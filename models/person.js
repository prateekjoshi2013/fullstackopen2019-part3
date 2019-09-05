const mongoose=require('mongoose')
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
    name:String,
    number:String
})

personSchema.set('toJSON',{
    transform:(doc,ret)=>{
        ret.id=ret._id.toString()
        delete ret._id
        delete ret.__V
    }
})
module.exports=mongoose.model('Person',personSchema)