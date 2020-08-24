const Database = require('./database/db')

const { subjects, weekdays, getSubject, convertHoursToMinutes } = require('./utils/format')

function pageLanding(req, res){
    return res.render('index.html')
}

function pageStudy(req, res){
    const filters = req.query

    if(!filters.subject || !filters.weekday || !filters.time){
        return res.render('study.html', { filters, subjects, weekdays })
    }

    // converter horas em minutos
    const timeToMinutes = convertHoursToMinutes(filters.time)


    console.log('Não tem campos vazios')

    const query = `
        SELECT classes.*, proffys.*
        FROM proffys
        JOIN classes ON (classes.proffy_id = proffys.id)
        WHERE EXISTS (
            SELECT class_schedule.*
            FROM class_schedule
            WHERE class_schedule.class_id = classes.id
            AND class_schedule.weekday = ${filters.weekday}
            AND class_schedule.time_from <= ${timeToMinutes}
            AND class_schedule.time_to > ${timeToMinutes}
        )
    `


}

function pageGiveClasses(req, res){
    const data = req.query
    
    const isNotEmpty = Object.keys(data).length > 0 //transformando data em array e vendo se é maior que 0
    //se tiver dados(data)
    if(isNotEmpty){

        data.subject = getSubject(data.subject)

        //adicionar data a lista de proffys 
        proffys.push(data)

        return res.redirect('/study')
    }  


    //se não, mostrar a página
    return res.render('give-classes.html', {subjects, weekdays})
}

module.exports = {
    pageLanding,
    pageStudy,
    pageGiveClasses
}