class Weather {
    constructor() {
        this.weatherData = {
            nameCity: null,
            degree: null,
            degreeFeelsLike: null,
            wind: null,
            icon: null
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
                <div class="weather" draggable="true" >
                <div class="weather-info">
                    <div class="weather_main">
                        <div class="degree-frame">
                            <p class="degre">${this.weatherData.degree}°</p> <!-- &#8451; -->
                            <div class="weather-picture">
                                <img src='http://openweathermap.org/img/wn/${this.weatherData.icon}@2x.png' alt="">
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
                this.weatherData.icon = jsonData.weather[0].icon;
                console.log(jsonData.weather[0].icon)
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

    // Touch event
    dragEvent = () => {
        const dragElement = document.querySelector('.weather');
        let offsetX,
            offsetY;

        dragElement.addEventListener('dragstart', (event)=>{

            if (event.target.nodeName === 'IMG') {
                event.preventDefault()
                // console.dir(event.target);
                // console.log(event.target);
                // console.log(event.target.parentNode.parentNode);
                // offsetX = dragElement.offsetX
                // offsetY = dragElement.offsetY
            } else {
                offsetX = event.offsetX;
                offsetY = event.offsetY;
            }
            

            
        })

        dragElement.addEventListener('dragend', (event)=>{

            dragElement.style.position = 'absolute';
            dragElement.style.top = `${event.pageY - offsetY}px`;
            dragElement.style.left = `${event.pageX - offsetX}px`;

            

        })
        
    }

    // Асинхронный запуск функций
    async run (city, elem) {
        await this.getWeather(city);
        await this.render(elem);
        await this.checkInput();
        await this.dragEvent();
    }
}


let weather = new Weather;
const renderHere = document.querySelector('.test');
let placeHere = weather.place = renderHere;
weather.run(null, placeHere)
// weather.run(null, '.test');



