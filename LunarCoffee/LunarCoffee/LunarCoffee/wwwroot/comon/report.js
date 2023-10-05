﻿



var Charts_Temp = [];
var colorChart = ['#3A416F', '#f53939', '#a8b8d8', '#cb0c9f', '#ffeb3b', '#ff7f0e', '#2ca02c', '#ffbb78', '#d62728', '#f7b6d2', '#ff9896', '#9467bd', '#dbdb8d', '#c5b0d5'
    , '#8c564b', '#c49c94', '#98df8a', '#e377c2', '#7f7f7f', '#c7c7c7', '#bcbd22', '#17becf', '#9edae5'];
var gradientStroke1 = ctx2.createLinearGradient(0, 230, 0, 50);

gradientStroke1.addColorStop(1, 'rgba(203,12,159,0.2)');
gradientStroke1.addColorStop(0.2, 'rgba(72,72,176,0.0)');
gradientStroke1.addColorStop(0, 'rgba(203,12,159,0)'); //purple colors

var gradientStroke2 = ctx2.createLinearGradient(0, 230, 0, 50);

gradientStroke2.addColorStop(1, 'rgba(20,23,39,0.2)');
gradientStroke2.addColorStop(0.2, 'rgba(72,72,176,0.0)');
gradientStroke2.addColorStop(0, 'rgba(20,23,39,0)'); //purple colors


function Return_Type_SER_PRO_MED_CARD_DEP (type, isProduct = 0) {
    switch (Number(type)) {
        case 0:

            return '<span class="badge bg-gradient-warning">' + Outlang["Tien_coc"] + '</span>';
            break;
        case 1:
            return (isProduct != 1)
                ?
                ('<span class="badge bg-gradient-primary">' + Outlang["Dich_vu"] + '</span>')
                :
                ('<span class="badge bg-gradient-success">' + Outlang["San_pham"] + '</span>');
            break;
        case 2:
            return '<span class="badge bg-gradient-dark">' + Outlang["The"] + '</span>  ';
            break;
        case 3:
            return '<span class="badge bg-gradient-info">' + Outlang["Thuoc"] + '</span>';
            break;
        default: return ''; break;
    }
}
function Return_Name_SER_PRO_MED_CARD_DEP (type, ServiceName, CardName, MedicineName) {
    switch (Number(type)) {
        case 0:

            return '<span class="text-sm text-gradient text-warning">' + Outlang["Tien_coc"] + '</span>';
            break;
        case 1:
            return '<span class="text-sm text-gradient text-primary">' + ServiceName + '</span>';
            break;
        case 2:
            return '<span class="text-sm text-gradient text-dark">' + CardName + '</span>  ';
            break;
        case 3:
            return '<span class="text-sm text-gradient text-info">' + MedicineName + '</span>';
            break;
        default: return ''; break;
    }
}
async function rp_doughnut (id, data, textName, valueName) {
    new Promise((resolve, reject) => {
        if (document.getElementById(id) != null) {
            let ctx3 = document.getElementById(id).getContext("2d");
            let data_Value = [];
            let data_Header = [];
            let data_Color = [];
            for (let i = 0; i < data.length; i++) {
                data_Header.push(data[i][textName])
                data_Value.push(data[i][valueName]);
                data_Color.push(colorChart[i % colorChart.length])
            }
            let config = {
                type: "doughnut",
                data: {
                    labels: data_Header,
                    datasets: [{
                        label: "",
                        weight: 9,
                        cutout: 60,
                        tension: 0.9,
                        pointRadius: 2,
                        borderWidth: 2,
                        backgroundColor: data_Color,
                        data: data_Value,
                        fill: false
                    }],
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            display: false,
                        }
                    },
                    interaction: {
                        intersect: false,
                        mode: 'index',
                    },
                    scales: {
                        y: {
                            grid: {
                                drawBorder: false,
                                display: false,
                                drawOnChartArea: false,
                                drawTicks: false,
                            },
                            ticks: {
                                display: false
                            }
                        },
                        x: {
                            grid: {
                                drawBorder: false,
                                display: false,
                                drawOnChartArea: false,
                                drawTicks: false,
                            },
                            ticks: {
                                display: false,
                            }
                        },
                    },
                },
            }
            if (typeof Charts_Temp[id] == "undefined") {
                Charts_Temp[id] = new Chart(ctx3, config);
            }
            else {
                Charts_Temp[id].destroy();
                Charts_Temp[id] = new Chart(ctx3, config);
            }
        }
        resolve()
    });
}
async function rp_pie (id, data, textName, valueName) {
    new Promise((resolve, reject) => {
        setTimeout(() => {
        if (document.getElementById(id) != null) {
       
            let ctx3 = document.getElementById(id).getContext("2d");
            let data_Value = [];
            let data_Header = [];
            let data_Color = [];
            for (let i = 0; i < data.length; i++) {
                data_Header.push(data[i][textName])
                data_Value.push(data[i][valueName]);
                data_Color.push(colorChart[i % colorChart.length])
            }
            let config = {
                type: "pie",
                data: {
                    labels: data_Header,
                    datasets: [{
                        label: "",
                        weight: 9,
                        cutout: 60,
                        tension: 0.9,
                        pointRadius: 2,
                        borderWidth: 2,
                        backgroundColor: data_Color,
                        data: data_Value,
                        fill: false
                    }],
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            display: false,
                        }
                    },
                    interaction: {
                        intersect: false,
                        mode: 'index',
                    },
                    scales: {
                        y: {
                            grid: {
                                drawBorder: false,
                                display: false,
                                drawOnChartArea: false,
                                drawTicks: false,
                            },
                            ticks: {
                                display: false
                            }
                        },
                        x: {
                            grid: {
                                drawBorder: false,
                                display: false,
                                drawOnChartArea: false,
                                drawTicks: false,
                            },
                            ticks: {
                                display: false,
                            }
                        },
                    },
                },
            }
            if (typeof Charts_Temp[id] == "undefined") {
                Charts_Temp[id] = new Chart(ctx3, config);
            }
            else {
                Charts_Temp[id].destroy();
                Charts_Temp[id] = new Chart(ctx3, config);
            }
        }
            resolve()
        }, 100)
    });
}
async function rp_bar (id, data, textName, valueName) {
    new Promise((resolve, reject) => {
        if (document.getElementById(id) != null) {
            let ctx3 = document.getElementById(id).getContext("2d");
            let data_Value = [];
            let data_Header = [];
            let data_Color = [];
            for (let i = 0; i < data.length; i++) {
                data_Header.push(data[i][textName])
                data_Value.push(data[i][valueName]);
                data_Color.push(colorChart[i % colorChart.length])
            }
            let _header= rp_devidelabel(data_Header, 2 );
            let config = {
                type: "bar",
                data: {
                    labels: _header,
                    datasets: [{
                        label: "",
                        weight: 5,
                        borderWidth: 0,
                        borderRadius: 4,
                        backgroundColor: data_Color,
                        data: data_Value,
                        fill: false,
                        maxBarThickness: 35
                    }],
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            display: false,
                        }
                    },
                    interaction: {
                        intersect: false,
                        mode: 'index',
                    },
                    scales: {
                        y: {
                            grid: {
                                drawBorder: false,
                                display: true,
                                drawOnChartArea: true,
                                drawTicks: false,
                                borderDash: [5, 5]
                            },
                            ticks: {
                                display: true,
                                padding: 3,
                                font: {
                                    size: 14,
                                    family: "Open Sans",
                                    style: 'normal' 
                                },
                                color: '#344767'
                            }
                        },
                        x: {
                            grid: {
                                drawBorder: false,
                                display: false,
                                drawOnChartArea: true,
                                drawTicks: true,
                            },
                            ticks: {
                                display: true,
                                color: '#344767',
                                padding: 0,
                                font: {
                                    size: 14,
                                    style: 'normal',
                                    family: "Open Sans",
                                    lineHeight: 1.2 
                                } 
                            }
                        },
                    },
                },
                plugins: [{
                    beforeInit: function (chart) {
                        chart.data.labels.forEach(function (e, i, a) {
                            if (/\n/.test(e)) {
                                a[i] = e.split(/\n/)
                            }
                        })
                    }
                }]
            }
            if (typeof Charts_Temp[id] == "undefined") {
                Charts_Temp[id] = new Chart(ctx3, config);
            }
            else {
                Charts_Temp[id].destroy();
                Charts_Temp[id] = new Chart(ctx3, config);
            }
        }
        resolve()
    });
}
async function rp_barhorizotal (id, data, textName, valueName) {
    new Promise((resolve, reject) => {
        if (document.getElementById(id) != null) {
            let ctx3 = document.getElementById(id).getContext("2d");
            let data_Value = [];
            let data_Header = [];
            let data_Color = [];
            for (let i = 0; i < data.length; i++) {
                data_Header.push(data[i][textName])
                data_Value.push(data[i][valueName]);
                data_Color.push(colorChart[i % colorChart.length])
            }

            let config = {
                type: "bar",
                data: {
                    labels: data_Header,
                    datasets: [{
                        label: "",
                        weight: 5,
                        borderWidth: 0,
                        borderRadius: 4,
                        backgroundColor: data_Color,
                        data: data_Value,
                        fill: false,
                        maxBarThickness: 35
                    }],
                },
                options: {
                    indexAxis: 'y',
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            display: false,
                        }
                    },
                    interaction: {
                        intersect: false,
                        mode: 'index',
                    },
                    scales: {
                        y: {
                            grid: {
                                drawBorder: false,
                                display: true,
                                drawOnChartArea: true,
                                drawTicks: false,
                                borderDash: [5, 5]
                            },
                            ticks: {
                                display: true,
                                padding: 10,
                                color: '#9ca2b7'
                            }
                        },
                        x: {
                            grid: {
                                drawBorder: false,
                                display: false,
                                drawOnChartArea: true,
                                drawTicks: true,
                            },
                            ticks: {
                                display: true,
                                color: '#9ca2b7',
                                padding: 10
                            }
                        },
                    },
                },
            }
            if (typeof Charts_Temp[id] == "undefined") {
                Charts_Temp[id] = new Chart(ctx3, config);
            }
            else {
                Charts_Temp[id].destroy();
                Charts_Temp[id] = new Chart(ctx3, config);
            }
        }
        resolve()
    });
}
async function rp_barcols (id, data, textName, dataColumn) {
    new Promise((resolve, reject) => {
        if (document.getElementById(id) != null) {
            let ctx3 = document.getElementById(id).getContext("2d");
            let data_Header = [];
            for (let i = 0; i < data.length; i++) {
                data_Header.push(data[i][textName])
            }
            let datasets = [];
            for (let i = 0; i < dataColumn.length; i++) {
                let label = dataColumn[i]["label"];
                let value = dataColumn[i]["value"];
                let e = {};
                e.weight = 5;
                e.borderWidth = 0;
                e.borderRadius = 4;
                e.backgroundColor = colorChart[i % colorChart.length];
                e.fill = false;
                e.maxBarThickness = 35;
                let data_Value = [];
                for (let j = 0; j < data.length; j++) {
                    data_Value.push(data[j][value]);
                }
                e.label = label;
                e.data = data_Value;
                datasets.push(e);
            }
            let config = {
                type: "bar",
                data: {
                    labels: data_Header,
                    datasets: datasets
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            display: true,
                        }
                    },
                    interaction: {
                        intersect: false,
                        mode: 'index',
                    },
                    scales: {
                        y: {
                            grid: {
                                drawBorder: false,
                                display: true,
                                drawOnChartArea: true,
                                drawTicks: false,
                                borderDash: [5, 5]
                            },
                            ticks: {
                                display: true,
                                padding: 10,
                                color: '#9ca2b7'
                            }
                        },
                        x: {
                            grid: {
                                drawBorder: false,
                                display: false,
                                drawOnChartArea: true,
                                drawTicks: true,
                            },
                            ticks: {
                                display: true,
                                color: '#9ca2b7',
                                padding: 10
                            }
                        },
                    },
                },
            }
            if (typeof Charts_Temp[id] == "undefined") {
                Charts_Temp[id] = new Chart(ctx3, config);
            }
            else {
                Charts_Temp[id].destroy();
                Charts_Temp[id] = new Chart(ctx3, config);
            }
        }
        resolve()
    });
}
async function rp_mixbarline (id, data, cat) {
    new Promise((resolve, reject) => {
        if (document.getElementById(id) != null) {
            let ctx3 = document.getElementById(id).getContext("2d");

            let listcat = [];
            let labelbar = '', labelline = '';
            let databar = [], dataline = [];
            for (let i = 0; i < data.length; i++) {
                for (j = 0; j < Object.keys(data[i]).length; j++) {
                    let val = data[i][Object.keys(data[i])[j]];

                    if (i == 0 && j != 0) databar.push(val);
                    if (i == 1 && j != 0) dataline.push(val);
                    if (i == 0 && j == 0) labelbar = val;
                    if (i == 1 && j == 0) labelline = val;
                }
            }
            for (var i = 0; i < cat.length; i++) {
                for (j = 0; j < Object.keys(cat[i]).length; j++) {
                    listcat.push(cat[i][Object.keys(cat[i])[j]]);
                }
            }


            let config = {
                type: "bar",
                data: {
                    labels: listcat,
                    datasets: [{
                        type: "bar",
                        label: labelbar,
                        weight: 5,
                        tension: 0.4,
                        borderWidth: 0,
                        pointBackgroundColor: "#3A416F",
                        borderColor: "#3A416F",
                        backgroundColor: '#3A416F',
                        borderRadius: 4,
                        borderSkipped: false,
                        data: databar,
                        maxBarThickness: 10,
                    },
                    {
                        type: "line",
                        label: labelline,
                        tension: 0.4,
                        borderWidth: 0,
                        pointRadius: 0,
                        pointBackgroundColor: "#cb0c9f",
                        borderColor: "#cb0c9f",
                        borderWidth: 3,
                        backgroundColor: gradientStroke1,
                        data: dataline,
                        fill: true,
                    }
                    ],
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            display: false,
                        }
                    },
                    interaction: {
                        intersect: false,
                        mode: 'index',
                    },
                    scales: {
                        y: {
                            grid: {
                                drawBorder: false,
                                display: true,
                                drawOnChartArea: true,
                                drawTicks: false,
                                borderDash: [5, 5]
                            },
                            ticks: {
                                display: true,
                                padding: 0,
                                color: '#344767',
                                font: {
                                    size: 14,
                                    family: "Open Sans",
                                    style: 'normal',
                                    lineHeight: 2
                                },
                            }
                        },
                        x: {
                            grid: {
                                drawBorder: false,
                                display: true,
                                drawOnChartArea: true,
                                drawTicks: true,
                                borderDash: [5, 5]
                            },
                            ticks: {
                                display: true,
                                color: '#344767',
                                padding: 10,
                                font: {
                                    size: 14,
                                    family: "Open Sans",
                                    style: 'normal',
                                    lineHeight: 2
                                },
                            }
                        },
                    },
                },
            }
            if (typeof Charts_Temp[id] == "undefined") {
                Charts_Temp[id] = new Chart(ctx3, config);
            }
            else {
                Charts_Temp[id].destroy();
                Charts_Temp[id] = new Chart(ctx3, config);
            }
        }
        resolve()
    });
}
async function rp_linenolabel (id, data, cat) {
    new Promise((resolve, reject) => {
        if (document.getElementById(id) != null) {
            let ctx3 = document.getElementById(id).getContext("2d");

            let listcat = [];
            let labelline = '';
            let dataline = [];

            for (let i = 0; i < data.length; i++) {
                for (j = 0; j < Object.keys(data[i]).length; j++) {
                    let val = data[i][Object.keys(data[i])[j]];
                    if (i == 0 && j != 0) dataline.push(val);
                    if (i == 0 && j == 0) labelline = val;
                }
            }
            for (var i = 0; i < cat.length; i++) {
                for (j = 0; j < Object.keys(cat[i]).length; j++) {
                    listcat.push(cat[i][Object.keys(cat[i])[j]]);
                }
            }
            let config = {
                type: "bar",
                data: {
                    labels: listcat,
                    datasets: [
                        {
                            type: "line",
                            label: labelline,
                            tension: 0.4,
                            borderWidth: 0,
                            pointRadius: 0,
                            pointBackgroundColor: "#cb0c9f",
                            borderColor: "#cb0c9f",
                            borderWidth: 3,
                            backgroundColor: gradientStroke1,
                            data: dataline,
                            fill: true,
                        }
                    ],
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            display: false,
                        }
                    },
                    interaction: {
                        intersect: false,
                        mode: 'index',
                    },
                    scales: {
                        y: {
                            grid: {
                                drawBorder: false,
                                display: false,
                                drawOnChartArea: true,
                                drawTicks: true,
                                borderDash: [5, 5]
                            },
                            ticks: {
                                display: false,
                                padding: 10,
                                color: '#344767',
                                font: {
                                    size: 11,
                                    family: "Open Sans",
                                    style: 'normal',
                                    lineHeight: 2
                                },
                            }
                        },
                        x: {
                            grid: {
                                drawBorder: false,
                                display: true,
                                drawOnChartArea: true,
                                drawTicks: true,
                                borderDash: [5, 5]
                            },
                            ticks: {
                                display: true,
                                color: '#344767',
                                padding: 0,
                                font: {
                                    size: 13,
                                    family: "Open Sans",
                                    style: 'normal',
                                    lineHeight: 2
                                },
                            }
                        },
                    },
                },
            }
            if (typeof Charts_Temp[id] == "undefined") {
                Charts_Temp[id] = new Chart(ctx3, config);
            }
            else {
                Charts_Temp[id].destroy();
                Charts_Temp[id] = new Chart(ctx3, config);
            }
        }
        resolve()
    });
}
function rp_devidelabel (data, numword) {
    try {
 
        let result = [];
        for (let i = 0; i < data.length; i++) {
            let e = JSON.parse(JSON.stringify(data[i]));
            let arrname = [];
            let obj = data[i].split(' ');
            let text = '';
            let fitext = 0;
            for (let j = 0; j < obj.length; j++) {
                if (j != obj.length - 1) {
                    if (obj[j] != undefined && obj[j].trim() != "") {

                        if (fitext < numword) {
                            text = text != "" ? (text + " " + obj[j].trim()) : obj[j].trim();
                        }
                        else {
                            fitext = 0;
                            arrname.push(text);
                            text = obj[j].trim();
                        }
                        fitext = fitext + 1;
                    }
                }
                else {
                    text = text != "" ? (text + " " + obj[j].trim()) : obj[j].trim();
                    arrname.push(text);
                }
            }
            e = arrname
            result.push(e);
        }
        return result;
    } catch (e) {
        return data;
    }
    
}