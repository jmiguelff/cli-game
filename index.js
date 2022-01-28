#!/usr/bin/env node

// Based on Fireship video
// https://www.youtube.com/watch?v=_oHByo8tiEY

import chalk from 'chalk';
import chalkAnimation from 'chalk-animation'
import inquirer from 'inquirer';
import gradient from 'gradient-string';
import figlet from 'figlet';
import { readFile } from 'fs/promises';
import { createSpinner } from 'nanospinner';

let playerName;
let questions = JSON.parse(await readFile("examples/questions.json", "utf-8"));

const sleep = (ms = 2000) => new Promise((r) => setTimeout(r, ms));

async function welcomeMessage() {
    const neonTitle = chalkAnimation.neon(
        'Who Wants To Win An Original IOC? \n',
        2
    );

    await sleep();
    neonTitle.stop();

    console.log(`
        ${chalk.bgBlue('HOW TO PLAY')}
        I am a process running on your computer.
        If you get any question wrong I will ${chalk.bgRed('DIE')}!
        So make sure you know your shit before answering...        
    `);
}

async function askName() {
    const answers = await inquirer.prompt({
        name: 'player_name',
        type: 'input',
        message: 'What is your name?',
        default() {
            return 'Player';
        },
    });

    playerName = answers.player_name;
}

async function question(name, message, choices, ans) {
    const qName = name;
    const answers = await inquirer.prompt({
        name: name,
        type: 'list',
        message: message,
        choices: choices,
    });

    return handleAnswer(answers[name] == ans);
}

async function askQuestions() {
    for (const q of questions) {
        await question(q.name, q.message, q.choices, q.answer);
    }
}

async function handleAnswer(isCorrect) {
    const spinner = createSpinner('Checking answer...').start();
    await sleep();

    if (isCorrect) {
        spinner.success({ text: `Nice work ${playerName}. That's a legit answer.`});
    } else {
        spinner.error({ text: `💀💀💀 Game over, you lose ${playerName}!`});
        process.exit(1);
    }
}

function winner() {
    console.clear();
    const msg = `Congrats , ${playerName} !\n GET YOUR IOC !`;

    figlet(msg, (err, data) => {
        console.log(gradient.pastel.multiline(data));
    });
}

await welcomeMessage();
await askName();
await askQuestions();
winner();