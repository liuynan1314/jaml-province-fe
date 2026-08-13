import { ajaxCall, getDetailConf } from './../common.js';
import './../components/weatherInfo.js';

export const weatherNameCodeMaps = {
    晴: 40,
    多云: 41,
    阴: 42,
    阵雨: 43,
    雷阵雨: 44,
    雷阵雨伴有冰雹: 45,
    雨夹雪: 46,
    小雨: 47,
    中雨: 48,
    大雨: 49,
    暴雨: 50,
    大暴雨: 51,
    特大暴雨: 52,
    阵雪: 53,
    小雪: 54,
    中雪: 55,
    大雪: 56,
    暴雪: 57,
    雾: 58,
    冻雨: 59,
    沙尘暴: 60,
    小到中雨: 61,
    中到大雨: 62,
    大到暴雨: 63,
    暴雨到大暴雨: 64,
    大暴雨到特大暴雨: 65,
    小到中雪: 66,
    中到大雪: 67,
    大到暴雪: 68,
    浮尘: 69,
    扬沙: 70,
    强沙尘暴: 71,
    浓雾: 72,
    龙卷风: 73,
    弱高吹雪: 74,
    轻雾: 75,
    强浓雾: 76,
    霾: 77,
    中度霾: 78,
    重度霾: 79,
    严重霾: 80,
    大雾: 81,
    特强浓雾: 82,
    雨: 83,
    雪: 84
};

let _model, _this;
export default {
    type: 'card',
    icon: 'cloud',
    styles: [
        'size.fullsize',
        Styles.css({
            '--jam-card-bodyslot-padding': '0.25rem 0.5rem'
        }),
        Styles.stylesheet({
            '.temp-wrapper': {
                color: 'var(--jam-color-fg-default)',
                position: 'absolute',
                width: '100%',
                justifyContent: 'center',
                top: '0.8rem'
            },
            '.weather-bottom': {
                width: '100%',
                height: 'calc(53% - 0.5rem)',
                marginTop: '0.5rem',
                position: 'relative',
                '.weather-list': {
                    width: 'calc(100% - 2rem)',
                    height: '100%',
                    gap: 's',
                    margin: '0 1rem',
                    overflow: 'auto',
                    scrollbarWidth: 'none',
                    '.weather-list-item': {
                        width: 'calc((100% - 2rem)/5)',
                        minWidth: 'calc((100% - 2rem)/5)',
                        height: '100%',
                        background: 'tint',
                        borderRadius: 'm',
                        cursor: 'pointer'
                    }
                },

                '.indicator-arrow': {
                    '--icon-height': '2rem',
                    '--offset-inline': '0',
                    position: 'absolute',
                    top: 'calc(50% - 1rem)',
                    width: '1rem',
                    height: 'var(--icon-height)',
                    backgroundRepeat: 'no-repeat',
                    backgroundSize: 'auto 100%',
                    zIndex: 10,
                    cursor: 'pointer',
                    transition: 'all .2s ease-in-out',
                    '&:hover': {
                        '--offset-inline': '.05rem',
                        transform: 'scale(1.2)'
                    },
                    '&.left': {
                        backgroundImage: 'url(./../../assets/images/icon_arrow_left.svg)',
                        left: 'var(--offset-inline)'
                    },
                    '&.right': {
                        backgroundImage: 'url(./../../assets/images/icon_arrow_right.svg)',
                        right: 'var(--offset-inline)'
                    }
                }
            },
            '.badge-item [slot=icon]': {
                minWidth: '2rem !important',
                minHeight: '2rem !important'
            }
        })
    ],
    components: [
        {
            type: 'container',
            styles: ['size.fullsize', 'css(overflow:hidden)'],
            components: [
                {
                    type: 'label',
                    cap: '{{temp}}',
                    class: 'temp-wrapper'
                },
                {
                    type: 'wrapper',
                    styles: ['css(width:100%;height:47%;)'],
                    components: jaml.var('selectedWeatherInfo', function (value) {
                        console.log('value', value);
                        return [
                            {
                                type: 'subWeatherCard',
                                styles: [Styles.stylesheet({})],
                                props: {
                                    id: '11',
                                    title: value.areaName,
                                    unit: jam.formatDate(new Date(), 'yyyy-MM-dd'),
                                    value: value.weatherData,
                                    icon: `<img src="../../assets/images/weather/weather_${value.weatherDataCode}.png">`,
                                    imgList: [
                                        {
                                            name: '温度',
                                            icon: 'temperature-empty'
                                        },
                                        {
                                            name: '湿度',
                                            icon: 'droplet'
                                        },
                                        {
                                            name: '风向',
                                            icon: 'wind'
                                        },
                                        {
                                            name: '降水量',
                                            icon: 'cloud-rain'
                                        }
                                    ]
                                },
                                vars: {
                                    data: {
                                        chartData: [
                                            {
                                                id: '01',
                                                name: '温度',
                                                value: Math.max(value.mintemp, (Number(value.mintemp) + Number(value.maxtemp)) / 2) + '℃'
                                            },
                                            {
                                                id: '01',
                                                name: '湿度',
                                                value: value.humidity + '%'
                                            },
                                            {
                                                id: '01',
                                                name: '风向',
                                                value: value.wind
                                            },
                                            {
                                                id: '01',
                                                name: '降水量',
                                                value: value.precipitation
                                            }
                                        ]
                                    }
                                },
                                styles: ['subWeatherCard.basic', 'css(width:100%;height:100%)']
                            }
                        ];
                    })
                },
                {
                    type: 'wrapper',
                    class: 'weather-bottom',
                    components: [
                        {
                            type: 'element',
                            class: 'indicator-arrow left',
                            onclick: function () {
                                scrollWeatherInfo(-1);
                            }
                        },
                        {
                            type: 'wrapper',
                            class: 'weather-list',
                            components: jaml.var('weatherData', function (val) {
                                return val.map((item, index) => {
                                    return {
                                        type: 'weatherInfoIndicator',
                                        class: 'weather-list-item',
                                        props: {
                                            dataDef: [
                                                {
                                                    id: '{{data.a.id}}',
                                                    title: '{{data.a.title}}',
                                                    dataType: 'analog'
                                                },
                                                {
                                                    id: '{{data.b.id}}',
                                                    title: '{{data.b.title}}',
                                                    icon: `<img src="../../assets/images/weather/weather_${item.weatherDataCode}.png">`
                                                },
                                                {
                                                    id: '{{data.c.id}}',
                                                    value: '{{data.c.value}}'
                                                }
                                            ]
                                        },
                                        vars: {
                                            data: {
                                                a: {
                                                    title: item.areaName,
                                                    id: '111'
                                                },
                                                b: {
                                                    title: item.weatherData,
                                                    id: '222'
                                                },
                                                c: {
                                                    value: item.temp,
                                                    id: '333'
                                                }
                                            }
                                        },
                                        styles: ['weatherInfoIndicator.basic', 'hover.crosshair', 'click.crosshair'],
                                        onclick(e) {
                                            let allItem = document.querySelectorAll('.weather-list-item');
                                            allItem.forEach(function (item) {
                                                item.style.border = 'none';
                                            });
                                            let parentDom = jam.closest(e.target, '.weather-list-item');
                                            parentDom.style.border = 'var(--jam-border-width-s) solid var(--jam-color-primary-default)';
                                            _model.selectedWeatherInfo = item;
                                            _model.temp = parseInt(item.mintemp) + '-' + parseInt(item.maxtemp) + '℃';
                                        }
                                    };
                                });
                            })
                        },
                        {
                            type: 'element',
                            class: 'indicator-arrow right',
                            onclick: function () {
                                scrollWeatherInfo(1);
                            }
                        }
                    ]
                }
            ]
        }
    ],
    methods: {
        initData() {
            jam.ajaxCall({
                urlKey: 'getWeatherData',
                data: {
                    areaId: getDetailConf('adcode'),
                    beginTime: jam.formatTime(new Date(), 'yyyy-MM-dd'),
                    endTime: jam.formatTime(new Date(), 'yyyy-MM-dd')
                },
                onsuccess(result) {
                    const { data } = result;
                    const { subAreaWeather = [] } = data ? data[0] || {} : {};

                    subAreaWeather.forEach(function (item) {
                        item.weatherDataCode = weatherNameCodeMaps[item.weatherData];
                        item.temp = parseInt(item.mintemp) + '-' + parseInt(item.maxtemp) + '℃';
                    });
                    _model.weatherData = subAreaWeather;
                    _model.selectedWeatherInfo = _model.weatherData[0] || {};
                    _model.temp = parseInt(subAreaWeather[0].mintemp) + '-' + parseInt(subAreaWeather[0].maxtemp) + '℃';
                    _model.weatherDataCode = weatherNameCodeMaps[_model.selectedWeatherInfo.weatherData];
                }
            });
        }
    },
    onmount: function () {
        _model = this.model;
        _this = this;
    },
    onafterrender: function () {
        this.initData();
    }
};

function scrollWeatherInfo(left) {
    const contentWidth = jam.findElement('.weather-list').clientWidth;
    const itemWidth = jam.findChild(jam.findElement('.weather-list'), 'jam-container').clientWidth;
    const gap = (contentWidth - itemWidth * 5) / 4;
    const leftOffset = jam.findElement('.weather-list').scrollLeft;
    jam.findElement('.weather-list').scroll({ left: leftOffset + (itemWidth * 3 + gap * 3) * left, behavior: 'smooth' });
}
