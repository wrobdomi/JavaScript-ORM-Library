// *** Client classes file

// *** These are sample classes that client can define 
// in order to save them in db


// -- Single object example -- -- -- -- -- -- -- -- -- -- -- -- -- //
// Description: Client saves single object in db
// Person < ---- > Database
class Person {
    constructor(id, name, age){
        this.id = id;
        this.name = name;
        this.age = age;
    }
}
// -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- //




// -- OneToOne relation example  -- -- -- -- -- -- -- -- -- -- -- -- -- //
// Description: Every Student has one StudentCard, client saves one student and one 
// student card at the same time
// Student, StudentCard < ----- > Database

class Student {
    constructor(id, name, surname, age, studentCard){
        this.id = id;
        this.name = name;
        this.surname = surname;
        this.age = age;
        this.studentCard = studentCard;
    }
}

class StudentCard {
    constructor(studentId, studentNumber, faculty){
        this.studentId = studentId;
        this.studentNumber = studentNumber;
        this.faculty = faculty;
    }
}
// -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- //





// -- OneToMany relation example -- -- -- -- -- -- -- -- -- -- -- -- -- //
// Description: Every Country has one or more cities, client saves one country
// and many cities at the same time

class Country {
    constructor(id, name, cities){
        this.id = id;
        this.name = name;
        this.cities = cities;
    }
}

class City {
    constructor(countryId, cityId, name, numberOfPeople){
        this.countryId = countryId;
        this.cityId = cityId;
        this.name = name;
        this.numberOfPeople = numberOfPeople;
    }
}

// -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- //