const express=require('express')
const app=express()
const request =require('request')
const date=require(__dirname+"/date.js")
const mongoose=require("mongoose")
const _=require('lodash')


const MongoClient = require('mongodb').MongoClient;
const uri = "mongodb+srv://kapp-69:afnankhan1@cluster0.zvcy6.mongodb.net/mydata?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true });
// client.connect(err => {
//   const collection = client.db("test").collection("devices");
//   // perform actions on the collection object
//   client.close();
// });



let day=date.getDay()

const bodyParser=require('body-parser');
const { urlencoded } = require('body-parser');

mongoose.connect(uri)




const todoSchema={
    name:String

}

const ToDo=new mongoose.model('Todo',todoSchema)




const todo1=new ToDo({name:"Sex"})
const todo2=new ToDo({name:"FAX"})

const defaultTodos=[todo1,todo2]


app.use(express.static("public"));

app.use(bodyParser.urlencoded({extended:true}))

app.set('view engine','ejs')

const listSchema={
    name:String,
    todos:[todoSchema]
}


const List=new mongoose.model("List",listSchema)


app.get("/",  (req,res)=>{
    ToDo.find({},(err,items)=>{
        if(err){
            console.log(err)
        }
        else{
            if(items.length==0){
                ToDo.insertMany(defaultTodos,(err)=>{
                    if(err){
                        console.log(err)
                    }
                    else{

                        
                        console.log("done successfully!!!")
                    }
                })
                res.redirect("/")   
            }

            res.render("list",{day:"today",toDos:items })
            console.log("NO ERRORS")
        }
    })

    
}  )

app.get("/:name",(req,res)=>{

    console.log(req.params.name)

    const customListName=req.params.name;

    List.findOne({name:customListName},(err,result)=>{

        if(!result){
            const list=new List({
                name:req.params.name,
                todos:defaultTodos
            
                });
                list.save();
                res.redirect("/"+customListName)
        }
        else {

            //show existing list

            console.log(result.todos)


            res.render("list",{day:result.name,toDos:result.todos})
        }

    })
    


})


app.post("/",(req,res)=>{
     item=req.body.toDo

    const listName=req.body.list;

     const todo=new ToDo({name:item})

console.log(listName)
    if(listName=="today"){
    todo.save()
    res.redirect("/")
}else{
    List.findOne({name:listName},(err,foundList)=>{

        foundList.todos.push(todo)
        foundList.save();
        res.redirect("/"+listName)
    })
}

})


//route to delete todo
app.post("/delete",(req,res)=>{
 
    const id=req.body.id;
    const listName=req.body.listName;

    if(listName=="today"){

    ToDo.findByIdAndRemove(id,(err)=>{
        if(err){
            console.log(err)
        }
        else{
            console.log("deleted")
            res.redirect("/")
        }
    })



    }

    else {
        List.findOneAndUpdate({name:listName},{$pull:{todos:{_id:id}}},(err,foundList)=>{

            

            if(!err){
                res.redirect("/"+listName)
                console.log("removed from "+listName)
            }


        })
    }




})

app.listen(process.env.PORT||3000,()=>{

    console.log("Running on port 3000")

})