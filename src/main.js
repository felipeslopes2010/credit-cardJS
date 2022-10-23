import "./css/index.css"
import IMask from "imask"

const ccBgColor01 = document.querySelector(".cc-bg svg > g g:nth-child(1) path")
const ccBgColor02 = document.querySelector(".cc-bg svg > g g:nth-child(2) path")
const ccLogo = document.querySelector(".cc-logo span:nth-child(2) img")

function setCardType(type) {
  const colors = {
    visa: ["#436D99", "#2D57F2"],
    mastercard: ["#DF6F29", "#C69347"],
    default: ["black, gray"],
  }

  ccBgColor01.setAttribute("fill", colors[type][0])
  ccBgColor02.setAttribute("fill", colors[type][1])
  ccLogo.setAttribute("src", `cc-${type}.svg`)
}

globalThis.setCardType = setCardType

const securityCode = document.querySelector("#security-code")
const securityCodePattern = {
  mask: "0000",
}
const securityCodeMasked = IMask(securityCode, securityCodePattern)

const expirationDate = document.querySelector("#expiration-date")
const expirationDatePattern = {
  mask: "MM{/}YY",
  blocks: {
    YY: {
      mask: IMask.MaskedRange,
      from: String(new Date().getFullYear()).slice(2),
      to: String(new Date().getFullYear() + 10).slice(2),
    },
    MM: {
      mask: IMask.MaskedRange,
      from: 1,
      to: 12,
    },
  },
}
const expirationDateMasked = IMask(expirationDate, expirationDatePattern)

const cardNumber = document.querySelector("#card-number")
const cardNumberPattern = {
  mask: [
    {
      mask: "0000 0000 0000 0000",
      regex: /^4\d{0,15}/,
      cardtype: "visa",
    },
    {
      mask: "0000 0000 0000 0000",
      regex: /(^5[1-5]\d{0,2}|^22[2-9]\d|^2[3-7]\d{0,2})\d{0,12}/,
      cardtype: "mastercard",
    },
    {
      mask: "0000 0000 0000 0000",
      cardtype: "default",
    },
  ],
  dispatch: function (appended, dynamicMasked) {
    const number = (dynamicMasked.value + appended).replace(/\D/g, "")
    const foundMask = dynamicMasked.compiledMasks.find(function (item) {
      return number.match(item.regex)
    })

    return foundMask
  },
}
const cardNumberMasked = IMask(cardNumber, cardNumberPattern)

const addButton = document.querySelector("#add-card")
const appWrapper = document.querySelector("#app")
const messageWrapper = document.querySelector("#message")

addButton.addEventListener("click", () => {
  let isFormComplete =
    cardNumberMasked.masked.isComplete &&
    cardHolder.value != "" &&
    expirationDateMasked.masked.isComplete &&
    String(securityCodeMasked.value).length >= 3

  if (isFormComplete) {
    appWrapper.classList.add("hide")
    messageWrapper.classList.remove("hide")
  } else {
    checkCardNumber()
    checkCardHolder()
    checkExpirationDate()
    checkSecurityCode()
  }
})

const okButton = document.querySelector("#ok-message")
okButton.addEventListener("click", () => {
  window.location.reload()
})

document.querySelector("form").addEventListener("submit", (event) => {
  event.preventDefault()
})

function checkCardNumber() {
  if (cardNumberMasked.masked.isComplete) {
    cardNumber.classList.remove("incomplete")
    cardNumber.classList.add("complete")
  } else {
    cardNumber.classList.remove("complete")
    cardNumber.classList.add("incomplete")
  }
}

function checkCardHolder() {
  if (cardHolder.value != "") {
    cardHolder.classList.remove("incomplete")
    cardHolder.classList.add("complete")
  } else {
    cardHolder.classList.remove("complete")
    cardHolder.classList.add("incomplete")
  }
}

function checkExpirationDate() {
  if (expirationDateMasked.masked.isComplete) {
    expirationDate.classList.remove("incomplete")
    expirationDate.classList.add("complete")
  } else {
    expirationDate.classList.remove("complete")
    expirationDate.classList.add("incomplete")
  }
}

function checkSecurityCode() {
  securityCode
  if (String(securityCodeMasked.value).length >= 3) {
    securityCode.classList.remove("incomplete")
    securityCode.classList.add("complete")
  } else {
    securityCode.classList.remove("complete")
    securityCode.classList.add("incomplete")
  }
}

const cardHolder = document.querySelector("#card-holder")
cardHolder.addEventListener("input", () => {
  const ccHolder = document.querySelector(".cc-holder .value")
  ccHolder.textContent = cardHolder.value
  checkCardHolder()
})

securityCodeMasked.on("accept", () => {
  updateSecurityCode(securityCodeMasked.value)
  checkSecurityCode()
})

function updateSecurityCode(code) {
  const ccSecurity = document.querySelector(".cc-security .value")
  ccSecurity.innerText = code
}

cardNumberMasked.on("accept", () => {
  const cardType = cardNumberMasked.masked.currentMask.cardtype
  setCardType(cardType)
  updateCardNumber(cardNumberMasked.value)
  checkCardNumber()
})

function updateCardNumber(number) {
  const ccNumber = document.querySelector(".cc-number")
  ccNumber.innerText = number
}

expirationDateMasked.on("accept", () => {
  updateExpirationDate(expirationDateMasked.value)
  checkExpirationDate()
})

function updateExpirationDate(date) {
  const ccExpiration = document.querySelector(".cc-expiration .value")
  ccExpiration.innerText = date
}
