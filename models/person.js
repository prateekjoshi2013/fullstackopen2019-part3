const mongoose=require('mongoose')
var uniqueValidator=require('mongoose-unique-validator')
mongoose.set('useFindAndModify', false)
const url=process.env.MONGODB_URI
console.log('connecting to', url)
mongoose.connect(url,{useNewUrlParser:true})
.then(result=>{
    console.log('connected to mongo db')
})
.catch((err)=>{
    console.log('error connecting to mongodb',err.message)
})
const personSchema= new mongoose.Schema({
    name:{type:String,required:true,minlength:3,unique:true},
    number:{type:String,required:true,minlength:8}
})

personSchema.set('toJSON',{
    transform:(doc,ret)=>{
        ret.id=ret._id.toString()
        delete ret._id
        delete ret.__V
    }
})

personSchema.plugin(uniqueValidator)
module.exports=mongoose.model('Person',personSchema)