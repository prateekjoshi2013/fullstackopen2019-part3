require('dotenv').config()
const express = require('express')
const app = express()
const bodyParser=require('body-parser')
const morgan = require('morgan')
const cors= require('cors')
const Person=require('./models/person')
app.use(express.static('build'))
app.use(cors())
app.use(bodyParser.json())
morgan.token('body', function (req, res) { return JSON.stringify(req.body) });
app.use(morgan(':method :url :status :response-time ms - :res[content-length] :body - :req[content-length]'));
 
// let persons = [
//   {
//     "name": "Arto Hellas",
//     "number": "040-123456",
//     "id": 1
//   },
//   {
//     "name": "Ada Lovelace",
//     "number": "39-44-5323523",
//     "id": 2
//   },
//   {
//     "name": "Dan Abramov",
//     "number": "12-43-234345",
//     "id": 3
//   },
//   {
//     "name": "Mary Poppendieck",
//     "number": "39-23-6423122",
//     "id": 4
//   }
// ]

app.get('/api/persons', (req, res) => {
  Person.find({}).then(persons=>{
    res.json(persons.map(p=>p.toJSON()))
})
})
app.get('/info',(req,res)=>{
  Person.find({}).then(persons=>{
    res.send(`Phonebook has info for ${persons.length} people \n
 \n ${new Date()}`)
})
  
})

app.delete('/api/persons/:id',(req,res,next)=>{
  const id=(req.params.id)
  console.log('->',id)
  // const person=persons.find(person=>person.id===id);
  // if(person){
  //   persons=persons.filter(person=>person.id!==id);
  //   res.status(204).end();
  // }else{
  //   res.status(404).end();
  // }
  Person.findByIdAndRemove(id).then(result=>{
    res.status(204).end()
  }).catch(err=>{next(err)})
})

app.put('/api/persons/:id',(req,res,next)=>{
  const id=(req.params.id)
  console.log('->',id)
  // const person=persons.find(person=>person.id===id);
  // if(person){
  //   persons=persons.filter(person=>person.id!==id);
  //   res.status(204).end();
  // }else{
  //   res.status(404).end();
  // }
  
  Person.findByIdAndUpdate(id,req.body,{new:true}).then(result=>{
    res.json(result.toJSON())
  }).catch(err=>{next(err)})
})


app.get('/api/persons/:id',(req,res,next)=>{
  const id=req.params.id
  console.log(id)
  Person.findById(id).then(person=>{
    if(person){
      res.json(person.toJSON())
    }else{
      res.status(404).end();  
    }
    
}).catch((err)=>{
  next(err)
})
})


app.post('/api/persons',(req,res,next)=>{
  const person=req.body;
  if(!person){
    res.status(404).json({error:'content missing'}).end()
  }else if(person&&(!person.name||!person.number)){
    if(!person.name){
      res.status(404).json({error:` name missing`}).end()
    }else if(!person.number){
      res.status(404).json({error:` number missing`}).end()
    }
  }
  // else if(persons.find(p=>p.name===person.name)){/
  //   res.status(404).json({error:'name must be unique'}).end();
  // }

  else{
    const p=new Person({...person})
    p.save().then(savedNote=>res.json(savedNote.toJSON()))
    .catch(err=>next(err))
  }
})

const errorHandler=(err,req,rep,next)=>{
  console.log(err.message)
  if(err.name==='CastError'&& err.kind==='ObjectId'){
    return rep.status(400).send({error:'malformatted id'})
  }
  next(err)
}
app.use(errorHandler)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})