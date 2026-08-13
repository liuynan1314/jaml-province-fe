import { weatherNameCodeMaps } from './../../src/modules/todayWeather.mjs';
import { COLOR_SET, hslaToJamAc } from '../utils/Constants.js';

jaml.register('weatherInfo', {
    type: 'wrapper',
    styles: [
        //
        'css(--radius:.375rem)',
        'padding:.625rem',
        'layout(overflow:hidden;transition:transform .3s ease-out)',
        'border(radius:var(--radius))',
        `background(${COLOR_SET.modulebgclr_deep})`,
        'flex(direction:column;gap:.625rem)',
        'hover.crosshair'
    ],
    components: jaml.var('info', (info) => {
        return [
            {
                type: 'label',
                cap: '{{info.areaName}}',
                styles: [
                    //
                    'padding(0)',
                    'border(radius:var(--radius) var(--radius) 0 0)',
                    `cap.css(height:1.7rem;lineHeight:1.7rem;width:100%;textAlign:center)`,
                    `cap.text(color:${jam.ac({ l: jam.acLumiO(1) })};size:.875rem;weight:bold)`,
                    `cap.background(image:linear-gradient(90deg, ${hslaToJamAc('hsla(208.8, 35.9%, 59%, 0.4)')} 0%, ${hslaToJamAc('hsla(208.8, 35.9%, 59%, 0.05)')} 100%))`
                ]
            },
            {
                type: 'wrapper',
                styles: [
                    //
                    'size.fullsize',
                    'flex(direction:column;)',
                    'css(justifyContent:flex-end;)',
                    `background(image:url(./../../assets/images/weather/weather_${weatherNameCodeMaps[info.weatherData]}.png;repeat:no-repeat;size:38%;position:center top;)`
                ],
                components: [
                    { type: 'label', cap: info.weatherData, styles: ['css(justifyContent:center;)'] },
                    {
                        type: 'indicator',
                        styles: [
                            //
                            'size.fullwidth',
                            'padding(0)',
                            'value.css(white-space:nowrap;)',
                            `value.text(size:1.125rem;weight:bold;color:${COLOR_SET.primarytextclr})`,
                            'indicator.unit.margin(0)',
                            'indicator.unit.background(transparent)',
                            'indicator.unit.text(size:.875rem;color:' + jam.acLumiText(10) + ')'
                        ],
                        value: `${info.mintemp ? parseInt(info.mintemp) : '~'}-${info.maxtemp ? parseInt(info.maxtemp) : '~'}`,
                        unit: '℃'
                    }
                ]
            }
        ];
    })
});
