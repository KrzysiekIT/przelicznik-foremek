<template>
  <div>
    <header class="header">
      <h1 class="header__main">Przelicznik foremek</h1>
      <h2 class="header__description">Skopiuj przepis, wklej i gotowe!</h2>
    </header>
    <main>
      <fieldset>
        <span class="settings__label settings__label--block">
          <label
            v-for="(action, index) in settings.actions.labels"
            :key="'action' + index"
            class="settings__label--inline"
          >
            <input
              type="radio"
              :value="index"
              v-model="settings.actions.selectedIndex"
              class="settings__radio"
            />
            <span class="settings__option-label">{{ action }}</span>
          </label>
        </span>
        <template v-if="chosen.action === 'Przelicz'">
          <span class="settings__label settings__label--block">
            z
            <label
              v-for="(form, index) in settings.forms.labels"
              :key="'form' + index"
              class="settings__label--inline"
            >
              <input
                type="radio"
                :value="index"
                v-model="settings.forms.selectedSourceIndex"
                class="settings__radio"
              />
              <span class="settings__option-label">{{ form.from }}</span>
            </label>
          </span>
          <span class="settings__label settings__label--block">
            na
            <label
              v-for="(form, index) in settings.forms.labels"
              :key="'form' + index"
              class="settings__label--inline"
            >
              <input
                type="radio"
                :value="index"
                v-model="settings.forms.selectedTargetIndex"
                class="settings__radio"
              />
              <span class="settings__option-label">{{ form.to }}</span>
            </label>
          </span>
          <label class="settings__label settings__label--block">
            <span class="settings__text">
              {{
                settings.forms.labels[settings.forms.selectedSourceIndex]
                  .boxLabel.source
              }}
            </span>
            <div
              v-for="(dimension, index) in settings.forms.labels[
                settings.forms.selectedSourceIndex
              ].args"
              :key="dimension + index"
            >
              <input
                type="number"
                class="settings__input"
                @keydown="numbersOnly($event)"
                v-model.number="
                  settings.forms.labels[settings.forms.selectedSourceIndex]
                    .dimensions[dimension].source
                "
              /><span
                v-if="
                  index + 1 <
                    settings.forms.labels[settings.forms.selectedSourceIndex]
                      .args.length
                "
                >x</span
              >
            </div>
          </label>
          <label class="settings__label settings__label--block">
            <span class="settings__text">
              {{
                settings.forms.labels[settings.forms.selectedTargetIndex]
                  .boxLabel.target
              }}
            </span>
            <div
              v-for="(dimension, index) in settings.forms.labels[
                settings.forms.selectedTargetIndex
              ].args"
              :key="dimension + index"
            >
              <input
                type="number"
                class="settings__input"
                @keydown="numbersOnly($event)"
                v-model.number="
                  settings.forms.labels[settings.forms.selectedTargetIndex]
                    .dimensions[dimension].target
                "
              /><span
                v-if="
                  index + 1 <
                    settings.forms.labels[settings.forms.selectedTargetIndex]
                      .args.length
                "
                >x</span
              >
            </div>
          </label>
        </template>
        <template v-if="chosen.action === 'Przemnóż'">
          <label class="settings__label settings__label--block">
            <span class="settings__text">Współczynnik</span>
            <input
              type="number"
              class="settings__input"
              @keydown="numbersOnly($event)"
              v-model.number="fraction"
            />
          </label>
        </template>
      </fieldset>
      <table class="recipe__table">
        <tbody>
          <tr>
            <td class="recipe__cell">
            <th class="recipe__description">Twój przepis</th>
              <textarea
                class="recipe__textarea recipe__textarea--input"
                v-model="recipe"
                placeholder="Tutaj wklej swój przepis do przeliczenia"
              ></textarea>
            </td>
            <td class="recipe__cell">
            <th class="recipe__description">Przepis po przeliczeniu</th>
              <output>
                <textarea
                  class="recipe__textarea recipe__textarea--output"
                  :value="newRecipe"
                ></textarea>
              </output>
            </td>
          </tr>
        </tbody>
      </table>
    </main>
  </div>
</template>

<script>
export default {
  computed: {
    factor() {
      const factor = {
        Przelicz: () => {
          return this.field.source / this.field.target;
        },
        Przemnóż: () => {
          return this.fraction;
        }
      };
      return factor[this.chosen.action]();
    },
    field() {
      const source = this.countField(
        this.settings.forms.labels[this.settings.forms.selectedSourceIndex]
          .base,
        this.settings.forms.labels[
          this.settings.forms.selectedSourceIndex
        ].args.map(
          dimension =>
            this.settings.forms.labels[this.settings.forms.selectedSourceIndex]
              .dimensions[dimension].source
        )
      );
      const target = this.countField(
        this.settings.forms.labels[this.settings.forms.selectedTargetIndex]
          .base,
        this.settings.forms.labels[
          this.settings.forms.selectedTargetIndex
        ].args.map(
          dimension =>
            this.settings.forms.labels[this.settings.forms.selectedTargetIndex]
              .dimensions[dimension].target
        )
      );
      return { source, target };
    },
    newRecipe() {
      let newRecipe = JSON.parse(JSON.stringify(this.recipe));
      //const r = /\d+/g;
      //const r = /(\d+[\/\d. ]*|\d)/g;
      // /½
      const r = /(\d+[\/\d.,%]*|\d)|[½⅓⅔⅕⅖⅗⅘⅙⅚⅛⅜⅝⅞]/g;
      let m;
      const numbersArray = [];
      while ((m = r.exec(this.recipe)) != null) {
        numbersArray.unshift(m);
      }
      for (let i = 0; i < numbersArray.length; i++) {
        newRecipe =
          newRecipe.slice(0, numbersArray[i]["index"]) +
          newRecipe.slice(
            numbersArray[i]["index"] + numbersArray[i][0].length,
            newRecipe.length
          );
        let newNumber = this.newNumber(numbersArray[i][0]);
        newRecipe =
          newRecipe.slice(0, numbersArray[i]["index"]) +
          newNumber +
          newRecipe.slice(numbersArray[i]["index"]);
      }
      return newRecipe;
    },
    chosen() {
      const { labels, selectedIndex } = this.settings.actions;
      return {
        action: labels[selectedIndex]
      };
    },
    base() {
      const {
        labels,
        selectedSourceIndex,
        selectedTargetIndex
      } = this.settings.forms;
      return {
        from: labels[selectedSourceIndex].base,
        to: labels[selectedTargetIndex].base
      };
    }
  },
  data() {
    return {
      PI: Math.PI,
      settings: {
        actions: {
          labels: ["Przelicz", "Przemnóż"],
          selectedIndex: 0
        },
        forms: {
          labels: [
            {
              base: "tortownica",
              from: "tortownicy",
              to: "trotownicę",
              boxLabel: {
                source: "Średnica podstawowa",
                target: "Średnica docelowa"
              },
              args: ["diameter"],
              dimensions: {
                diameter: {
                  source: 1,
                  target: 1
                }
              }
            },
            {
              base: "blacha",
              from: "blachy",
              to: "blachę",
              boxLabel: {
                source: "Wymiary podstawowe",
                target: "Wymiary docelowe"
              },
              args: ["length", "height"],
              dimensions: {
                length: {
                  source: 1,
                  target: 1
                },
                height: {
                  source: 1,
                  target: 1
                }
              }
            }
          ],
          selectedSourceIndex: 0,
          selectedTargetIndex: 0
        }
      },
      fraction: 1,
      recipe: "",
      diameter: {
        source: 1,
        target: 1
      },
      length: {
        source: { width: 1, height: 1 },
        target: { width: 1, height: 1 }
      }
    };
  },
  methods: {
    numbersOnly(event) {
      const keyCode = event.key;
      if (".,01234567890".includes(keyCode)) {
        return;
      }
      if (["Delete", "Backspace"].includes(keyCode)) {
        return;
      }
      event.preventDefault();
    },
    countField(figure, args) {
      console.log(figure, args);
      const field = {
        tortownica: diameter => {
          return (this.PI * diameter ** 2) / 4;
        },
        blacha: (length, height) => {
          return length * height;
        }
      };
      return field[figure](...args);
    },
    getFieldSource() {
      const forms = this.settings.forms;
      if (forms.labels[forms.selectedSourceIndex].base === "tortownica") {
        return (this.PI * this.diameter.source * this.diameter.source * 1) / 4;
      } else {
        return this.length.source.width * this.length.source.height;
      }
    },
    getFieldTarget() {
      const forms = this.settings.forms;
      if (forms.labels[forms.selectedTargetIndex].base === "tortownica") {
        return (this.PI * this.diameter.target * this.diameter.target * 1) / 4;
      } else {
        return this.length.target.width * this.length.target.height;
      }
    },
    fitForm() {
      const fractions = {
        Przemnóż: +this.fraction,
        Przelicz: this.field.target / this.field.source
      };
      return fractions[this.chosen.action];
    },
    testFraction(text) {
      const conditions = Array.from("⅓⅔⅕⅖⅗⅘⅙⅚⅛⅜⅝⅞");
      const fractionChar = conditions.some(el => text.includes(el));
      return fractionChar;
    },
    fractionCharToNumber(text) {
      const convert = {
        "½": 1 / 2,
        "⅓": 1 / 3,
        "⅔": 2 / 3,
        "⅕": 1 / 5,
        "⅖": 2 / 5,
        "⅗": 3 / 5,
        "⅘": 4 / 5,
        "⅙": 1 / 6,
        "⅚": 5 / 6,
        "⅛": 1 / 8,
        "⅜": 3 / 8,
        "⅝": 5 / 8,
        "⅞": 7 / 8
      };
      return convert[text];
    },
    newNumber(oldNumber) {
      let processedNumber;
      let type;
      if (oldNumber.includes("%")) {
        type = "percent";
      } else if (oldNumber.includes("/")) {
        type = "fraction";
      } else if (oldNumber.includes(",")) {
        oldNumber = oldNumber.replace(",", ".");
        type = "number";
      } else if (this.testFraction(oldNumber)) {
        oldNumber = this.fractionCharToNumber(oldNumber);
        type = "number";
      } else {
        type = "number";
      }
      switch (type) {
        case "percent":
          {
            processedNumber = oldNumber;
          }
          break;
        case "fraction":
          {
            const parts = oldNumber.split("/");
            if (parts[1] === "") {
              processedNumber = parseFloat(parts[0]) * this.fitForm();
            } else {
              processedNumber =
                Math.round(
                  (parseFloat(parts[0]) * 100 * this.fitForm()) /
                    parseFloat(parts[1])
                ) / 100;
            }
          }
          break;
        case "number":
          {
            processedNumber =
              Math.round(parseFloat(oldNumber) * 100 * this.fitForm()) / 100;
          }
          break;
      }
      return processedNumber;
    }
  }
};
</script>

<style>
@keyframes moveInLeft {
  0% {
    opacity: 0;
    transform: translateX(-10rem);
  }
  80% {
    transform: translateX(1rem);
  }
  100% {
    opacity: 1;
    transform: translate(0);
  }
}

@keyframes moveInRight {
  0% {
    opacity: 0;
    transform: translateX(10rem);
  }
  80% {
    transform: translateX(-1rem);
  }
  100% {
    opacity: 1;
    transform: translate(0);
  }
}
.title__main {
  text-align: center;
}
.title__description {
  text-align: center;
}
.header {
  margin: 1rem 0 3rem 0;
}
.header__main {
  position: relative;
  animation: moveInLeft 1s ease-out;
  backface-visibility: hidden;
  font-size: 4rem;
  text-align: center;
}
.header__description {
  animation: moveInRight 1s ease-out;
  backface-visibility: hidden;
  font-size: 2rem;
  letter-spacing: 0.1675rem;
  text-align: center;
}
.settings__radio {
  opacity: 0;
  position: absolute;
  display: inline-block;
  visibility: hidden;
}
.settings__radio:checked + .settings__option-label {
  cursor: default;
}
.settings__radio:checked + .settings__option-label::before {
  transform: scale(0.9);
  padding: 0.15rem;
  border: 0.375rem solid #add8e6;
  box-shadow: 0 0 0 0.1875rem #004;
  background: #004;
}
.settings__option-label {
  display: flex;
  align-items: center;
  padding: 0 0;
  transition: all 0.25s linear;
  cursor: pointer;
}
.settings__option-label::before {
  display: inline-block;
  content: "";
  height: 1.6875rem;
  width: 1.6875rem;
  margin-right: 0.9375rem;
  border: 0.15rem solid #004;
  border-radius: 50%;
  transition: all 0.25s linear;
}
.settings__label {
  font-size: 2rem;
  margin: 1rem;
}
.settings__label--block {
  align-items: center;
  display: flex;
}
.settings__label--inline {
  display: inline-block;
  margin-left: 1rem;
}
.settings__input {
  background-color: transparent;
  border: 0.1rem solid #004;
  color: #004;
  font-family: "Delius";
  font-size: 2rem;
  font-weight: 800;
  padding: 0.5rem;
  width: 4.4rem;
}
.settings__text {
  margin-right: 1rem;
}
.recipe__table {
  width: 100%;
}
.recipe__cell {
  text-align: center;
}
.recipe__description {
  display: block;
  font-size: 2rem;
}
.recipe__textarea {
  background-color: transparent;
  border: 0.1rem solid #004;
  color: #004;
  font-family: "Delius";
  font-size: 2rem;
  min-height: 50vh;
  padding: 1rem;
  resize: none;
  width: 100%;
}

/* Chrome, Safari, Edge, Opera */
input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

/* Firefox */
input[type="number"] {
  -moz-appearance: textfield;
}

fieldset {
  border: none;
}

@media only screen and (max-width: 600px) {
  .recipe__cell, .recipe__description {
    display: block;
  }
}
</style>
