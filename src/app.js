import {createModal, questionIsValid} from "./utils";
import './styles.css';
import {Question} from "./question";
import {authWithEmailAndPassword, getAuthForm} from "./auth";

const form = document.getElementById("form-question");
const showAllBtn = document.getElementById("showAllBtn");
const input = form.querySelector('#question-input');
const submitBtn = form.querySelector('#submit-question');

window.addEventListener('load', Question.renderList);

form.addEventListener('submit', submitFormHandler);

showAllBtn.addEventListener('click', openModalRegistration);

input.addEventListener('input', () => {
    submitBtn.disabled = !questionIsValid(input.value);
})

function submitFormHandler(event) {
    event.preventDefault();

    if (questionIsValid(input.value.trim())) {
        const question = {
            text: input.value.trim(),
            date: new Date().toJSON()
        }

        submitBtn.disabled = true;
        // Async request to server to save question
        Question.create(question).then(() => {
            input.value = '';
            input.className = '';
            submitBtn.disabled = false;
        })
    }
}

function openModalRegistration() {
    createModal('Авторизация', getAuthForm());
    document.getElementById('auth-form')
        .addEventListener('submit', authFormHandler, {once: true})
}

function authFormHandler(event) {
    event.preventDefault();

    const btn = event.target.querySelector('button')
    const email = event.target.querySelector('#email').value;
    const password = event.target.querySelector('#password').value;

    btn.disabled = true;
    authWithEmailAndPassword(email, password)
        .then(Question.fetch)
        .then(renderModalAfterAuth)
        .then(() => {btn.disabled = false});
        // .catch(() => btn.disabled = false);
}

function renderModalAfterAuth(content) {
    console.log(content);
    if (typeof content === 'string') {
        createModal('Ошибка!', content);
    } else {
        createModal('Список вопросов', Question.listToHtml(content));
    }
}
