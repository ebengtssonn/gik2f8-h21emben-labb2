const { error } = require('console');
const { json } = require('express');
const express = require('express');
const app = express();
const fs = require('fs/promises');

const PORT = 5000;
app.use(express.json())
.use(express.urlencoded({extended:false}))
.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "*");
    res.header("Access-Control-Allow-Methods", "*");

    next();
});

app.get('/tasks', async (req, res) => {
    try{
        const task = await fs.readFile("./tasks.json");
        res.status(200).send(JSON.parse(task));
    }
    catch(error)
    {
        res.status(500).send({error: error.stack});
    }

});

app.post("/tasks", async(req,res) =>{
    try {
        const task = req.body;
        const listBuffer = await fs.readFile("./tasks.json");
        const currentTasks = JSON.parse(listBuffer);
        let nextTaskId = 1;
        if (currentTasks && currentTasks.length > 0) {
            nextTaskId = currentTasks.reduce((maxId, currentElement) => currentElement.id > maxId ? currentElement.id : maxId,
            nextTaskId
            );
            nextTaskId++;
        } 

        const nextTask = {id: nextTaskId, ...task};
        const taskList = currentTasks ? [...currentTasks, nextTask] : [nextTask];

        await fs.writeFile('./tasks.json',JSON.stringify(taskList));
        
        res.send(nextTask);
    } 
    catch (error) {
        res.status(500).send({error: error.stack});
    }
});

app.patch("/tasks/:id", async(req, res) =>{
    
    const id = req.params.id;
    try{
        const listBuffer = await fs.readFile("./tasks.json");
        const currentTasks = JSON.parse(listBuffer);

        currentTasks.forEach(task => {
            if(task.id == id && task.completed == false){
                task.completed = true;
            } 
            else if(task.id == id && task.completed == true){
                task.completed = false;
            }
        });
        
        await fs.writeFile('./tasks.json',JSON.stringify(currentTasks));
    }
    catch(error) {
        res.status(500).send({error: error.stack});
    }

    res.send({messege:`Uppgiften med id: ${id} uppdaterades`});

});

app.delete("/tasks/:id", async(req, res) =>{
    /*localhost:5000/task/id*/
    const id = req.params.id;
    try {
        const listBuffer = await fs.readFile("./tasks.json");
        const currentTasks = JSON.parse(listBuffer);
        if (currentTasks.length > 0) {
            await fs.writeFile("./tasks.json",JSON.stringify(currentTasks.filter(task => task.id != id )));
            res.send({messege:`Uppgiften med id: ${id} togs bort`});
        }
        else{
            res.status(404).send({error: 'Ingen uppgift att ta bort'});
        }
    } 
    catch (error) {
        res.status(500).send({error: error.stack});
    }
});

app.listen(PORT, () => console.log('Server running on http://localhost:5000'));