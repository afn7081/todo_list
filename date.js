

module.exports.getDate=getDate

module.exports.getDay=getDay

function getDate(){
var today=new Date()
         
var options={
    weekday:"long",
    day:"numeric",
    month:"long"
}
var date=today.toLocaleDateString("en-us",options)
return date;
}
function getDay(){
    var today=new Date()
             
    var options={
        weekday:"long"
    }
    var date=today.toLocaleDateString("en-us",options)
    return date;
    }