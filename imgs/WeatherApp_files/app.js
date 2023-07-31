const searchBtn = document.querySelector("#search-btn");
const loader= document.querySelector("#loader")
const search = document.getElementById("search");
const getWether=  (location) => {
searchBtn.disabled=true;
const options = {method: 'GET', headers: {accept: 'application/json'}};
fetch(`https://api.tomorrow.io/v4/weather/forecast?location=${location}&apikey=XtnvyJoF8FvRm3KxAgVSwBCBH7CACU2t`, options)
  .then(response => response.json())
  .then(response => {
    loader.style.display="none";
    console.log(response)
    const result= getResult(response);
    localStorage.setItem("wetherResult",JSON.stringify(result));
    searchBtn.disabled=false;
    displayResult(result);
  })
  .catch(err => console.error(err));
}
searchBtn.onclick=(e)=>{
    e.preventDefault();
    const inpt=document.querySelector("#form-input")
    const searchTxt = search.value;
    search.value="";
    if(!/^[A-Za-z0-9\s]+$/.test(searchTxt)){
        alert('please enter correct value');
        inpt.style.border="solid1px red";
    }
else{
 inpt.style.border="solid 1px";
 loader.style.display="block";
 getWether(searchTxt);
}
}
function displayResult(res){
    const todaydiv = document.querySelector("#today-weather");
    const daildiv = document.querySelector("#daily-hourly"); 
    document.querySelector("#user-location").innerHTML=`
    <h3> Location: ${res.location} </h3>
    <h2> Today weather </h2>
    <div>
    <span class="material-symbols-outlined">thermometer</span> Temperature:
      max: <b>${res.daily[0].maxtemp} °C </b> min: <b>${res.daily[0].mintemp} °C</b>
    </div>
    <div>
    <span class="material-symbols-outlined">weather_mix</span>  Rain Probability:
      <b>${res.daily[0].rain}%</b>
    </div>
    <div>
    <span class="material-symbols-outlined">humidity_midy</span> Humidity:
      <b>${res.daily[0].humidity}</b>
    </div>
    <div>
    <span class="material-symbols-outlined">air</span> Wind Speed:
      <b>${res.daily[0].windspeed} Km/h</b>
    </div>
    `;
     daildiv.innerHTML=res.daily.map(day => `
        <div class="day">
          <span>${day.name}</span>
          <div>
            <span class="material-symbols-outlined">thermometer</span> Temperature: 
            max: <b>${day.maxtemp}</b> min: <b>${day.mintemp}</b>
          </div>
          <div>
            <span class="material-symbols-outlined">weather_mix</span>  Rain Probability:
            <b>${day.rain}%</b>
          </div>
          <div>
            <span class="material-symbols-outlined">humidity_midy</span> Humidity:
            <b>${day.humidity}</b>
          </div>
          <div>
            <span class="material-symbols-outlined">air</span> Wind Speed:
            <b>${day.windspeed} Km/h</b>
          </div>
        </div>
      `).join("");

}

function getResult(response){
    let daily = response.timelines.daily.map((data)=>{
        let mydata = {
            name:getDayNameFromDate(data.time),
            avtemp:data.values.temperatureAvg,
            maxtemp:data.values.temperatureMax,
            mintemp:data.values.temperatureMin,
            cloud:data.values.cloudBaseAvg,
            humidity:data.values.humidityAvg,
            rain: data.values.rainAccumulationSum,
            windspeed:data.values.windSpeedAvg
        }
        return mydata;
    });
    const result = {
        location:response.location.name,
        daily:daily,
        hourly:response.timelines.hourly,  
    }
return result;
}

function getDayNameFromDate(dateString) {
    const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const dateObject = new Date(dateString);
    const dayIndex = dateObject.getDay();
    const dayName = daysOfWeek[dayIndex];
    return dayName;
  }
  