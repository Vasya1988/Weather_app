class Weather {
    constructor() {
        this.weatherData = {
            nameCity: null,
            degree: null,
            degreeFeelsLike: null,
            wind: null
        }
         // Ключ для доступа к API
        this.myKey = '57ad26d8d8989166f0ae73503542de6d';
        // let cityName = prompt('Введи название города');
        this.lang = 'ru';
        this.place;
    }
    
    // Рендерим разметку на страницу
    render = ()=>{
        return new Promise((resolve, reject)=>{
            const markup =`
                <div class="weather">
                <div class="weather-info">
                    <div class="weather_main">
                        <div class="degree-frame">
                            <p class="degre">${this.weatherData.degree}°</p> <!-- &#8451; -->
                            <div class="weather-picture">
                                <img src="image/light-mode-icon.png" alt="">
                            </div>
                        </div>
                        <div class="desciption">
                            <p class="feels_like">Ощущается как ${this.weatherData.degreeFeelsLike}°</p>
                            <p class="wind">Ветер ${this.weatherData.wind} м/сек</p>
                        </div>
                        <div class="name-frame">
                            <p class="name-city">${this.weatherData.nameCity}</p>
                        </div>
                    </div>

                    

                </div>

                <div class="formName">
                    <input class="enterName" data-city placeholder="Введите город" type="text">
                </div>

            </div>
            `;
            console.log(this.place)
            this.place.innerHTML = markup;
            resolve()
        })
    }

    // Отправляем запрос на API сайта погоды
    getWeather = (city, key) => {
        city = city || 'moscow';
        key = '57ad26d8d8989166f0ae73503542de6d' || key;
        return new Promise((resolve, reject) => {
            // mode 'units="metric" - Переводит градусы по цельсию
            let getData = fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${key}&units=metric&lang=ru`)
            .then((result)=>{
                return result.json()
            }).then((jsonData)=>{
                console.log('API response --> ', jsonData);
                this.weatherData.nameCity = jsonData.name;
                this.weatherData.degree = Math.trunc(jsonData.main.temp);
                this.weatherData.degreeFeelsLike = Math.trunc(jsonData.main.feels_like);
                this.weatherData.wind = Math.trunc(jsonData.wind.speed);
                // console.log(this.weatherData);
            });
            resolve(getData);
        })
    }

    // Забираем название города из инпута
    checkInput = () => {
        return new Promise((resolve, reject) => {
            const enterName = document.querySelector('[data-city]')
            // console.log('Чекнутый инпут --> ', a)
            enterName.addEventListener('change', (item)=>{
                // console.log(item.target.value);
                this.run(item.target.value)
                return item.target.value
            })
            resolve(enterName)
        })
    }

    // Асинхронный запуск функций
    async run (city, elem) {
        await this.getWeather(city);
        await this.render(elem)
        await this.checkInput()
    }
}


let weather = new Weather;
const renderHere = document.querySelector('.test');
let placeHere = weather.place = renderHere;
weather.run(null, placeHere)
// weather.run(null, '.test');



