<template>
  <div>
    <header class="header">
      <h1 class="header__main">Przelicznik foremek</h1>
      <h2 class="header__description">Kopiuj, wklej i gotowe!</h2>
    </header>
    <main>
      <fieldset>
        <label class="settings__label settings__label--block">
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
        </label>
        <template
          v-if="
            settings.actions.labels[settings.actions.selectedIndex] ===
              'Przelicz'
          "
        >
          <label class="settings__label settings__label--block"
            >z
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
          </label>
          <label class="settings__label settings__label--block"
            >na
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
          </label>
        </template>
      </fieldset>

      <div
        v-if="
          settings.actions.labels[settings.actions.selectedIndex] === 'Przemnóż'
        "
      >
        <div style="display: inline-block; width: 170px;">
          Współczynnik:&nbsp;
        </div>
        <input v-model="fraction" class="input" />
      </div>
      <div class="forms_inputs" v-else>
        <div>
          <div
            v-if="
              settings.forms.labels[settings.forms.selectedSourceIndex].base ===
                'foremka'
            "
          >
            <div style="display: inline-block; width: 170px;">
              Średnica&nbsp;podstawowa:&nbsp;
            </div>
            <input v-model="diameter.source" class="input" />
          </div>
          <div
            v-if="
              settings.forms.labels[settings.forms.selectedSourceIndex].base ===
                'blacha'
            "
          >
            <div style="display: inline-block; width: 170px;">
              Wymiary&nbsp;podstawowe:&nbsp;
            </div>
            <input class="input" v-model="length.source.width" />x<input
              class="input"
              v-model="length.source.height"
            />
          </div>
        </div>
        <div>
          <div
            v-if="
              settings.forms.labels[settings.forms.selectedTargetIndex].base ===
                'foremka'
            "
          >
            <div style="display: inline-block; width: 170px;">
              Średnica&nbsp;docelowa:&nbsp;
            </div>
            <input
              class="input"
              placeholder="Średnica docelowa"
              v-model="diameter.target"
            />
          </div>
          <div
            v-if="
              settings.forms.labels[settings.forms.selectedTargetIndex].base ===
                'blacha'
            "
          >
            <div style="display: inline-block; width: 170px;">
              Wymiary&nbsp;docelowe:&nbsp;
            </div>
            <input v-model="length.target.width" class="input" />x<input
              class="input"
              v-model="length.target.height"
            />
          </div>
        </div>
      </div>
      <table class="recipe__table">
        <thead>
          <tr>
            <th class="recipe__description">Twój przepis</th>
            <th class="recipe__description">Przepis po przeliczeniu</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td class="recipe__cell">
              <textarea
                class="recipe__textarea recipe__textarea--input"
                v-model="recipe"
                placeholder="Tutaj wklej swój przepis do przeliczenia"
              ></textarea>
            </td>
            <td class="recipe__cell">
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
    <footer></footer>
  </div>
</template>

<script>
export default {
  computed: {
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
    }
  },
  data() {
    return {
      settings: {
        actions: {
          labels: ["Przelicz", "Przemnóż"],
          selectedIndex: 0
        },
        forms: {
          labels: [
            { base: "foremka", from: "foremki", to: "foremkę" },
            { base: "blacha", from: "blachy", to: "blachę" }
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
      },
      tiramisu: false,
      carbonarra: false
    };
  },
  methods: {
    getFieldSource() {
      const forms = this.settings.forms;
      if (forms.labels[forms.selectedSourceIndex].base === "foremka") {
        return (Math.PI * this.diameter.source * this.diameter.source * 1) / 4;
      } else {
        return this.length.source.width * this.length.source.height;
      }
    },
    getFieldTarget() {
      const forms = this.settings.forms;
      if (forms.labels[forms.selectedTargetIndex].base === "foremka") {
        return (Math.PI * this.diameter.target * this.diameter.target * 1) / 4;
      } else {
        return this.length.target.width * this.length.target.height;
      }
    },
    fitForm() {
      if (
        this.settings.actions.labels[this.settings.actions.selectedIndex] ===
        "Przemnóż"
      ) {
        return +this.fraction;
      }
      return this.getFieldTarget() / this.getFieldSource();
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
        type = "fracion";
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
        case "fracion":
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
  margin: 3rem 0 3rem 0;
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
  border: 0.375rem solid #ffb6c1;
  box-shadow: 0 0 0 0.1875rem #00f;
  background: #00f;
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
  border: 0.15rem solid #008;
  border-radius: 50%;
  transition: all 0.25s linear;
}
.settings__label {
  font-size: 2rem;
}
.settings__label--block {
  display: flex;
}
.settings__label--inline {
  display: inline-block;
  margin-left: 1rem;
}
.recipe__table {
  width: 100%;
}
.recipe__description {
  font-size: 2rem;
}
.recipe__textarea {
  background-color: transparent;
  border: 0.1rem solid #008;
  font-size: 1.5rem;
  min-height: 50vh;
  padding: 1rem;
  resize: none;
  width: 100%;
}
</style>
