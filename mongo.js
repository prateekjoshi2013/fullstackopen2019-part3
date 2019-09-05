const mongoose=require('mongoose')
if(process.argv.length<1){
    console.log('give password as argument')
    process.exit(1)
}
const password=process.argv[2]
const url=`mongodb+srv://fullstack:${password}@cluster0-ch7lx.mongodb.net/phonebook?retryWrites=true&w=majority`
mongoose.connect(url,{useNewUrlParser:true})
const personSchema= new mongoose.Schema({
    name:String,
    number:String,
    id:Number
})

const Person = mongoose.model('Person',personSchema)
if(process.argv.length==3){
    Person.find({}).then(res=>{
        res.forEach(p=>{
            console.log(p.name,p.number)
        })
        mongoose.connection.close()
    })
}else if(process.argv.length==5){
    const person=new Person({
        name:process.argv[3],
        number:process.argv[4],
        id:process.argv[5]
    })
    
    
    person.save().then(res=>{
        console.log('added',person.name,'number',person.number,'to phonebook')
        mongoose.connection.close()
    })
}



