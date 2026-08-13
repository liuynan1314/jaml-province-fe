import { weatherNameCodeMaps } from './../../src/modules/todayWeather.mjs';

jaml.register('weatherInfo', {
    type: 'wrapper',
    styles: [
        //
        'padding(m)',
        'layout(overflow:hidden;transition:transform .3s ease-out)',
        'border.s',
        'with.elevation',
        'flex(direction:column;gap:m)',
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
                    'border(radius:s s 0 0)',
                    `cap.css(height:1.7rem;lineHeight:1.7rem;width:100%;textAlign:center)`,
                    'cap.text(color:onprimary;size:s;weight:bold)',
                    // 已降级: cap gradient needs theme primary stops
                    'cap.background(image:linear-gradient(90deg, var(--jam-color-primary-subtle) 0%, var(--jam-color-primary-film) 100%))'
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
                            'value.text(size:l;weight:bold)',
                            'value.color.primary',
                            'indicator.unit.margin(0)',
                            'indicator.unit.background(transparent)',
                            'indicator.unit.text(size:s;color:muted)'
                        ],
                        value: `${info.mintemp ? parseInt(info.mintemp) : '~'}-${info.maxtemp ? parseInt(info.maxtemp) : '~'}`,
                        unit: '℃'
                    }
                ]
            }
        ];
    })
});
