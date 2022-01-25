document.getElementsByClassName("indDiv")[0].style.display = "none"
// document.getElementsByClassName("indDiv")[0].style.display = "flex"
// document.getElementsByClassName("search")[0].style.display = "none"
// document.getElementsByClassName("content")[0].style.display = "none"

// Global variables
var countryData
var names = []
var regions = [["Asia",[]],["Americas",[]],["Africa",[]],["Europe",[]],["Oceania",[]]]
var countryCodeList = []

// Individual variables
var country,capital,population,region,imgSrc,subregion,nativeName,topDomain,currency,languages,borderCountries,countryCode


// Creating and displaying elements 
function createBox(json) {
    // Getting info
    country = json.name
    capital = json.capital
    region = json.region
    population = json.population
    imgSrc = json.flags.png
    countryCode = json.alpha3Code

    // Creating div and appending
    var temp = document.createElement("div")
    temp.className = "contentBox"
    temp.setAttribute("id",json.name)
    var par = document.getElementsByClassName("content")[0]
    par.appendChild(temp)
    temp.innerHTML = "<img src=" + imgSrc + " alt=''> <div class='contentInside'><h3>" + country + "</h3>  <p class='pfirstChild'><b>Population : </b>"+ population +"</p>        <p><b>Region : </b>" + region + "</p>    <p><b>Capital : </b>" + capital + " </p> </div>"
    // Appending vars for later use
    names.push(country)
    regions.forEach(i=>{
        if (i[0] == region){
            i[1].push(country)
        }
    })
    countryCodeList.push([countryCode,country])
}


fetch("https://restcountries.com/v2/all")
    .then(response => response.json())
    .then(data=>{
        countryData = data
        for (let i = 0; i < data.length; i++) {
            createBox(data[i])
        }
        sepPage()
    })


// Filter by region
function hideOtherRegions(list) {
    names.forEach(x => {
        if (list.includes(x)){
            if (document.getElementById(x).classList.contains("hide")){
                document.getElementById(x).classList.remove("hide")
                document.getElementById(x).style.display = "flex"
            }
        }else{
            document.getElementById(x).style.display = "none"
            document.getElementById(x).classList.add("hide")
        }       
    });    
}

document.getElementsByClassName("filter")[0].addEventListener("click",()=>{
    document.getElementsByClassName("dropDown")[0].classList.toggle("hide")
})

var filterItems = document.getElementsByClassName("dropDownItems")
for (let i = 0; i < filterItems.length; i++) {
    const element = filterItems[i];
    element.addEventListener("click",()=>{
        var filtername = element.childNodes.item(1).textContent

        if (filtername == "All"){
            names.forEach(x => {
                document.getElementById(x).style.display = "flex"  
                if (document.getElementById(x).classList.contains("hide")){
                    document.getElementById(x).classList.remove("hide")
                }   
            })
        }else{
            regions.forEach(j=>{
                if (j[0] == filtername){
                    hideOtherRegions(j[1])
                }
            })
        }
    })
    
}

// SearchBar
document.getElementById("searchInput").addEventListener("input",()=>{
    var filtername = document.getElementById("searchInput").value
    filtername = filtername.toUpperCase()

    names.forEach(i=>{
        if (i.toUpperCase().indexOf(filtername) > -1){
            if (document.getElementById(i).classList.contains("hide")){
                document.getElementById(i).classList.remove("hide")
            }
            document.getElementById(i).style.display = "flex"
        }else{
            document.getElementById(i).style.display = "none"
            document.getElementById(i).classList.add("hide")
        }
    })

})

// Separate Page
var back = []
var t
document.getElementsByClassName("backbuton")[0].addEventListener("click",()=>{
    if (back.length == 0){
        document.getElementsByClassName("search")[0].style.display = "flex"
        document.getElementsByClassName("content")[0].style.display = "grid"
        document.getElementsByClassName("indDiv")[0].style.display = "none"
    }else{
        var pop = back.pop()
        console.log(pop,back)
        setContent(pop)
    }
})
function setContent(i) {
    countryData.forEach(json=>{
        if (json.name == i){
            imgSrc = json.flags.png
            country = json.name
            population = json.population
            capital = json.capital
            region = json.region
            subregion = json.subregion
            nativeName = json.nativeName
            topDomain = json.topLevelDomain
            languages = json.languages
            currency = json.currencies
            borderCountries = json.borders

            // Language
            t = ""
            languages.forEach(languagae =>{
                t+= languagae.name + ", "
            })
            languages = t

            // topDomain
            t = ""
            topDomain.forEach(domain =>{
                t+= domain + " "
            })
            topDomain = t

            // Currrency
            t = ""
            currency.forEach(cur =>{
                t+= cur.name + " "
            })
            currency = t

            // BorderCountries
            if (borderCountries){
                t=[]
                borderCountries.forEach(code=>{
                    countryCodeList.forEach(z=>{
                        if (z[0] == code){
                            t.push(z[1])
                        }
                    })
                })
                borderCountries = t
                t=""
                borderCountries.forEach(c=>{
                    t+= "<div class='buton'><p>" + c + "</p></div>"
                })
                document.getElementsByClassName("borderCountries")[0].innerHTML = t
            }

            // Changing DAta
            document.getElementById("sepImg").src = imgSrc
            document.getElementById("sepTitle").innerText = country
            document.getElementById("item1").innerHTML = "<b>Native Name : </b>" + nativeName
            document.getElementById("item2").innerHTML = "<b>Population : </b>" + population
            document.getElementById("item3").innerHTML = "<b>Region : </b>" + region
            document.getElementById("item4").innerHTML = "<b>Sub Region : </b>" + subregion
            document.getElementById("item5").innerHTML = "<b>Capital : </b>" + capital
            document.getElementById("item6").innerHTML = "<b>Top Level Domain : </b>" + topDomain
            document.getElementById("item7").innerHTML = "<b>Currencies : </b>" + currency
            document.getElementById("item8").innerHTML = "<b>Langauges : </b>" + languages

            

            document.getElementsByClassName("indDiv")[0].style.display = "flex"
            var butons = document.getElementsByClassName("buton")
            for (let i = 0; i < butons.length; i++) {
                const element = butons[i];
                element.addEventListener("click",()=>{
                   back.push(country)
                   setContent(element.textContent)
                })                     
            }
        }
    })
}

function sepPage() {
    names.forEach(i=>{
        document.getElementById(i).addEventListener("click",()=>{
            // Hiding main page
            document.getElementsByClassName("search")[0].style.display = "none"
            document.getElementsByClassName("content")[0].style.display = "none"
    
            // Display separate page
            setContent(i)
        })
    })
}

// Home
document.getElementById("headerTitle").addEventListener("click",()=>{
    document.getElementsByClassName("search")[0].style.display = "flex"
    document.getElementsByClassName("content")[0].style.display = "grid"
    document.getElementsByClassName("indDiv")[0].style.display = "none"
    back = []
})


// Theme
document.getElementsByClassName("mode")[0].addEventListener("click",()=>{
    if (document.getElementsByClassName("modeType")[0].textContent == "Dark Mode"){
        document.getElementsByClassName("mode")[0].innerHTML = "<i class='far fa-lightbulb'></i><h4 class='modeType'>Light Mode</h4>"
        document.documentElement.style.setProperty("--clipElement-background","hsl(209, 23%, 22%)")
        document.documentElement.style.setProperty("--clipMain-background","hsl(207, 26%, 17%)")
        document.documentElement.style.setProperty("--element-shadow","hsl(209, 23%, 20%)")
        document.documentElement.style.setProperty("--font-color","hsl(0, 0%, 100%)") 
        setTimeout(()=>{
            document.documentElement.style.setProperty("--body-color","hsl(207, 26%, 17%)")
            document.documentElement.style.setProperty("--element-color","hsl(209, 23%, 22%)") 
        },400)  
        document.querySelectorAll(".clip").forEach(item=>{
            item.style.clipPath = "circle(150% at 93.4% 2.2rem)"
        })
    }else{
        document.getElementsByClassName("mode")[0].innerHTML = "<i class='far fa-moon'></i><h4 class='modeType'>Dark Mode</h4>"
        document.documentElement.style.setProperty("--element-color","white")
        document.documentElement.style.setProperty("--body-color","hsl(0, 0%, 98%)")
        document.documentElement.style.setProperty("--font-color","hsl(200, 15%, 8%)")  
        document.documentElement.style.setProperty("--element-shadow","hsl(0, 0%, 80%)")  
        setTimeout(()=>{
            document.documentElement.style.setProperty("--clipElement-background","white")
            document.documentElement.style.setProperty("--clipMain-background","hsl(0, 0%, 98%)") 
        },400) 
        document.querySelectorAll(".clip").forEach(item=>{
            item.style.clipPath = "circle(2rem at 93.4% 2.2rem)"
        })
    }

})


