const inquirer = require('inquirer');
const fs = require('fs');
const path = require('path');
const {
    PROJECT_PATH
} = require("./constants");
const {exec,execSync} = require("child_process");
const commandExists = require('command-exists');


const dirs = fs.readdirSync(PROJECT_PATH, {
    withFileTypes: true
}).filter(d => !d.isFile()).map(d => d.name);

inquirer.prompt([{
            type: "list",
            message: "What do you want to do",
            name: "task",
            choices: ["Open Project", "New Project"]
        },
        {
            type: "input",
            message: "Enter project name",
            name: "name",
            when: ans => ans.task === "New Project"
        },
        {
            //TODO
            type: "list",
            message: "Select Project Type",
            name: "type",
            choices: ["NodeJS", "React", "C++", "Python"],
            when: ans => ans.task === "New Project"
        },
        {
            type: "list",
            message: "Select a project",
            name: "directory",
            choices: dirs,
            when: ans => ans.task === "Open Project",
            loop: false
        }
    ])
    .then(({
        name,
        task,
        directory,
        type
    }) => {
        switch (task) {
            case "Open Project":
                openProject(path.join(PROJECT_PATH, directory));
                break;

            case "New Project":
                const prPath = path.join(PROJECT_PATH, name)
                fs.mkdirSync(prPath);
                /*
                TODO add type support for new projects
                */
                switch (type) {

                    /* 
                    TODO Complete Type Support
                     case "NodeJS":
                        execSync(`cd "${prPath}" && npm init`);
                        break;
                    case "React":
                        break; */
                    case "C++":
                        fs.writeFileSync(path.join(prPath,"main.cpp"),"");
                        break;
                    case "Python":
                        fs.writeFileSync(path.join(prPath,"main.py"),"");
                        break;
                    default:
                        throw new Error("Something Went Wrong");
                }
                openProject(prPath);

                break;
            default:
                throw new Error("Something Went Wrong!");
                break;
        }
    })
/**
 * 
 * @param {String} projectPath Path of the project
 * @returns {void} 
 */
function openProject(projectPath) {
    commandExists('code').then(() => {
        exec(`code "${projectPath}"`, (err, stdout, stderr) => {
            if (err)
                throw new Error(err);
            if (stderr)
                throw new Error(stderr);
            process.exit(0);
        })
    }).catch(function () {
        throw new Error("Visual Studio Code is not installed!");
    });

}