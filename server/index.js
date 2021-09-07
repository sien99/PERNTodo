const express = require("express");
const app = express();
const cors = require("cors");
const pool = require("./db");

//middleware
app.use(cors());
app.use(express.json());

//ROUTES//

//create a todo

app.post("/todos",async(req,res)=>{
    //async
    //await -wait from function aft await complete be4 cont.
    try{
        //req.body catch data from POST request to /todos
        const { description } = req.body;
        //$1 placeholder of value for [?] specified behind
        //put [description ] means $1=description
        const newTodo= await pool.query("INSERT INTO todo (description) VALUES($1) RETURNING *",
        [description]
        );
        // Returning * data we add
        res.json(newTodo.rows[0]);
    } catch(err){
        console.error(err.message);
    }

})

//get all todos

app.get("/todos", async(req,res)=>{
    try{
        //using same cmd to DATABASE, retrieve data in "todo" table
        //res it using json format
        const allTodos = await pool.query("SELECT * FROM todo");
        res.json(allTodos.rows);
    }catch(err){
        console.error(err.message);
    }
});

//get a todo
//dynamic url, id = req.params
app.get("/todos/:id", async(req,res)=>{
    try{
        const { id } = req.params;
        //WHERE clause specify what data we want
        const todo = await pool.query("SELECT * FROM todo WHERE todo_id = $1",[id]
        );
        res.json(todo.rows[0]);
    }catch (err){
        console.error(err.message);
    }
});

//update a todo

app.put("/todos/:id", async(req,res)=>{
    try{
        // need to ensure description update tgt with id
        const { id } = req.params;
        const { description } = req.body;
        //SET is use to select COLUMN data we want to chg
        const updateTodo = await pool.query("UPDATE todo SET description = $1 WHERE todo_id =$2",
        [description,id]
        );

        res.json("Todo was updated!")
    }catch(err){
        console.error(err.message);
    }
});

//delete a todo

app.delete("/todos/:id", async(req,res)=>{
    try{
        const { id } = req.params;
        const deleteTodo = await pool.query("DELETE FROM todo WHERE todo_id =$1",
        [id]
        );

        res.json("Todo was deleted!");
    }catch(err){
        console.error(err.message);
    }
});

app.listen(5000,()=>{
    console.log("server has started on port 5000");
})