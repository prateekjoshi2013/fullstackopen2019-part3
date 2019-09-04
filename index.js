const express = require('express')
const app = express()
const bodyParser=require('body-parser')
const morgan = require('morgan')
const cors= require('cors')
app.use(express.static('build'))
app.use(cors())
app.use(bodyParser.json())
morgan.token('body', function (req, res) { return JSON.stringify(req.body) });
app.use(morgan(':method :url :status :response-time ms - :res[content-length] :body - :req[content-length]'));
 
let persons = [
  {
    "name": "Arto Hellas",
    "number": "040-123456",
    "id": 1
  },
  {
    "name": "Ada Lovelace",
    "number": "39-44-5323523",
    "id": 2
  },
  {
    "name": "Dan Abramov",
    "number": "12-43-234345",
    "id": 3
  },
  {
    "name": "Mary Poppendieck",
    "number": "39-23-6423122",
    "id": 4
  }
]

app.get('/api/persons', (req, res) => {
  res.json(persons)
})
app.get('/info',(req,res)=>{
  res.send(`Phonebook has info for ${persons.length} people \n
 \n ${new Date()}`)
})

app.delete('/api/persons/:id',(req,res)=>{
  const id=Number(req.params.id)
  const person=persons.find(person=>person.id===id);
  if(person){
    persons=persons.filter(person=>person.id!==id);
    res.status(204).end();
  }else{
    res.status(404).end();
  }
})

app.get('/api/persons/:id',(req,res)=>{
  const id=Number(req.params.id)
  const person=persons.find(person=>person.id===id);
  if(person){
    res.json(person);
  }else{
    res.status(404).end();
  }
})


app.post('/api/persons',(req,res)=>{
  const person=req.body;
  if(!person){
    res.status(404).json({error:'content missing'}).end()
  }else if(person&&(!person.name||!person.number)){
    if(!person.name){
      res.status(404).json({error:` name missing`}).end()
    }else if(!person.number){
      res.status(404).json({error:` number missing`}).end()
    }
  }else if(persons.find(p=>p.name===person.name)){
    res.status(404).json({error:'name must be unique'}).end();
  }else{
    const id=Math.floor(Math.random()*(10000-0))+0;
    console.log(id)
    person.id=id;
    persons.push(person) 
    res.json(person);

  }
})


const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})