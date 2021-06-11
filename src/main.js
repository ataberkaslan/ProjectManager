const inquirer = require('inquirer');
const fs = require('fs');
const path = require('path');
const constants = require("./constants");
const exec = require("child_process").exec;

const dirs = fs.readdirSync(constants.PROJECT_PATH,{withFileTypes:true}).filter(d => !d.isFile()).map(d => d.name);

inquirer.prompt([
    {
        type:"list",
        message:"What do you want to do",
        name:"task",
        choices:["Open Project","New Project"]
    },
    {
        type:"input",
        message:"Enter project name",
        name:"name",
        when:ans => ans.task === "New Project"
    },
    {
        type:"list",
        message:"Select a project",
        name:"directory",
        choices:dirs,
        when:a => a.task === "Open Project",
        loop:false
    }
])
        .then(({name,task,directory}) => {
            switch (task) {
                case "Open Project":
                    openProject(path.join(constants.PROJECT_PATH,directory));
                    break;
            
                case "New Project":
                    const prPath = path.join(constants.PROJECT_PATH,name)
                    fs.mkdirSync(prPath);
                    openProject(prPath);
                    
                    break;
                default:
                    console.error("Something Went Wrong");
                break;
            }
})
/**
 * 
 * @param {String} projectPath Path of the project
 * @returns {void} 
 */
function openProject(projectPath){
    exec(`code ${projectPath}`,(err,stdout,stderr) => {
        if(err)
        return console.error(err);
        if(stderr)
        return console.error(stderr);
        process.exit(0);
    })
}