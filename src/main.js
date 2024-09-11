import 'ol/ol.css'; // 引入OpenLayers的CSS样式
import Map from 'ol/Map';
import View from 'ol/View';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import {Draw} from "ol/interaction";
import {Style} from "ol/style";
import {Circle} from "ol/style";
import {Fill} from "ol/style";
import {Vector as VectorLayer} from 'ol/layer';
import {Vector as VectorSource} from 'ol/source';
import {Stroke} from "ol/style";
import shp from 'shpjs'
import $ from 'jquery';
import {GeoJSON} from "ol/format";

/**
 * 获取数据库列表
 * @returns {Promise<void>}
 */
const fetchTables = async () => {
    try {
        const response = await fetch('http://localhost:3000/tables');
        const tables = await response.json();
        console.log('Tables:', tables);
    } catch (error) {
        console.error('Error fetching tables:', error);
    }
};

// 定义变量来存储绘制的json实体
let geoJsonEntitis = []

// 创建绘制图层
var source = new VectorSource();
var drawLayer = new VectorLayer({
    source: source
});
// 创建并初始化地图,定位到北京
const map = new Map({
    target: 'map', // 指定地图要渲染的DOM元素的id
    layers: [
        new TileLayer({
            source: new OSM(),
        }),
        drawLayer
    ],
    view: new View({
        center: [116.38, 39.90], // 地图初始中心点（经纬度）
        zoom: 8, // 地图初始缩放级别
        projection: 'EPSG:4326', // 确保视图使用 EPSG:3857 投影
    }),
});
// 创建图层

let draw;
// 绘制点
$('#point').click(function () {
    if (draw != undefined && draw != null) {
        map.removeInteraction(draw);
    }
    draw = new Draw({
        source: source,
        type: 'Point',
        style: new Style({
            image: new Circle({
                radius: 10,
                fill: new Fill({
                    color: 'red'
                })
            })
        })
    });
    map.addInteraction(draw);
})

// 绘制线
$('#lineString').click(function () {
    if (draw != undefined && draw != null) {
        map.removeInteraction(draw);
    }
    draw = new Draw({
        source: source,
        type: 'LineString',
        style: new Style({
            image: new Circle({
                radius: 10,
                fill: new Fill({
                    color: 'red'
                })
            }),
            stroke: new Stroke({
                color: 'yellow',
                width: 2
            })
        })
    });
    map.addInteraction(draw);
})

// 绘制面
$('#polygon').click(function () {
    if (draw != undefined && draw != null) {
        map.removeInteraction(draw);
    }
    draw = new Draw({
        source: source,
        type: 'Polygon',
        style: new Style({
            image: new Circle({
                radius: 10,
                fill: new Fill({
                    color: 'red'
                })
            }),
            stroke: new Stroke({
                color: 'yellow',
                width: 2
            }),
            fill: new Fill({
                color: 'blue'
            })
        })
    });
    map.addInteraction(draw);
    // 监听 drawend 事件，当绘制完成时获取 Feature
    draw.on('drawend', function (event) {
        console.log(event)
        const feature = event.feature;
        // 将 Feature 转换为 GeoJSON
        const geojsonFormat = new GeoJSON();
        const geojsonObject = geojsonFormat.writeFeatureObject(feature);
        // 打印 GeoJSON 对象
        console.log('绘制的面对应的GeoJSON对象:', geojsonObject);
        // 将对象添加到绘制结果中
        geoJsonEntitis.push(geojsonObject)
    });
})

// 绘制圆
$('#circle').click(function () {
    if (draw != undefined && draw != null) {
        map.removeInteraction(draw);
    }
    draw = new Draw({
        source: source,
        type: 'Circle',
        style: new Style({
            image: new Circle({
                radius: 10,
                fill: new Fill({
                    color: 'red'
                })
            }),
            stroke: new Stroke({
                color: 'yellow',
                width: 2
            }),
            fill: new Fill({
                color: 'blue'
            })
        })
    });
    map.addInteraction(draw);
})

// 结束绘制
$('#stop').click(function () {
    if (draw != undefined && draw != null) {
        map.removeInteraction(draw);
    }
})

// 数据入库
$('#save').click(function () {
    // 判断结果不为空
    alert("功能没做")
})

// 获取数据库中存在空间字段的表
$('#pgconnect').click(async function () {
    let message = '数据库空间表：';
    try {
        const response = await fetch('http://localhost:3000/tables');
        const tables = await response.json();
        // console.log('Tables:', tables);
        // 遍历结果并拼接提示信息
        for (let i = 0; i < tables.length; i++) {
            message += tables[i].f_table_name + ",  ";
        }
        // console.log(message);
        alert(message)
    } catch (error) {
        console.error('Error fetching tables:', error);
    }
});

// 刷新图层管理中的图层项
$('#reload').click(async function () {
    try {
        const response = await fetch('http://localhost:3000/tables');
        const tables = await response.json();
        // 获取 ul 元素
        const ulElement = document.getElementById('tables-list');
        // 清空 ul 中的所有子元素
        ulElement.innerHTML = '';
        // 默认初始化一个绘制图层管理项
        addDrawLayerToMenu(ulElement)
        // 遍历结果并拼接提示信息
        for (let i = 0; i < tables.length; i++) {
            // 数据库表对应地图图层，需要向  <ul id="tables-list"> 元素中添加ul
            const table = tables[i];
            // 拿到这个图层的名字之后需要去数据库中拿空间数据，创建一个图层。
            // 这里的逻辑先空着，实现了shp转geojson之后同步修改


            // 创建 li 元素
            const li = document.createElement('li');
            // 创建按钮元素
            const button = document.createElement('button');
            // 按钮的id先给index序列
            button.id = i;
            button.className = 'toggle-btn';
            button.textContent = '显示';
            // 动态生成的按钮需要添加一个事件来控制当前图层的隐藏和显示，示例见addDrawLayerToMenu函数中按钮添加的点击方法
            button.addEventListener('click', function () {
                // 在这里处理按钮点击事件

            });
            // 将表格名称和按钮添加到 li 元素
            li.textContent = table.f_table_name;
            li.appendChild(button);
            // 将 li 元素添加到 ul 元素中
            ulElement.appendChild(li);
        }
    } catch (error) {
        console.error('Error fetching tables:', error);
    }
});


/**
 * 因为地图初始化的时候已经默认加载了一个绘制图层，所有的绘制操作都在该图层
 * 右侧管理列表默认添加一个绘制图层的选项到图层管理列表，防止动态刷新的时候丢掉
 * @param ulElement
 */
function addDrawLayerToMenu(ulElement) {
    // 创建 li 元素
    const li = document.createElement('li');
    // 创建按钮元素
    const button = document.createElement('button');
    button.id = 'draw';
    button.className = 'toggle-btn';
    button.textContent = '隐藏';
    // 为按钮添加点击事件，这个按钮应该控制绘制图层的显示和隐藏
    button.addEventListener('click', function () {
        // 在这里处理按钮点击事件
        // drawLayer是一开始就定义的绘制图层，能够通过getVisible()方法拿到显示隐藏的状态，从而控制图层显示隐藏
        if (drawLayer.getVisible()) {
            drawLayer.setVisible(false);
            button.textContent = '显示';
        } else {
            drawLayer.setVisible(true);
            button.textContent = '隐藏';
        }
    });
    // 将表格名称和按钮添加到 li 元素
    li.textContent = '绘制图层';
    li.appendChild(button);
    // 将 li 元素添加到 ul 元素中
    ulElement.appendChild(li);
}

// 读取 Shapefile 文件并加载到地图
document.getElementById('shapefile').addEventListener('change', function (event) {
    // 获取选择的文件
    const file = event.target.files[0];

    if (file) {
        // 打印文件信息（例如：文件名和大小）
        console.log('File name:', file.name);
        console.log('File size:', file.size);
        file.arrayBuffer().then((file) => {
            shp(file).then((geojson) => {
                // 创建一个 VectorSource 来包含 GeoJSON 数据
                const shpvectorSource = new VectorSource({
                    features: (new GeoJSON()).readFeatures(geojson, {
                        featureProjection: 'EPSG:4326'
                    })
                });

                // 创建一个 VectorLayer 显示 GeoJSON 数据
                const shpvectorLayer = new VectorLayer({
                    source: shpvectorSource
                });
                map.addLayer(shpvectorLayer)
            });
        })

    }
});



