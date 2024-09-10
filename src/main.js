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
// import {getAllTables} from "./DBoption";

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
// 创建并初始化地图
const map = new Map({
    target: 'map', // 指定地图要渲染的DOM元素的id
    layers: [
        new TileLayer({
            source: new OSM(),
        }),
        drawLayer
    ],
    view: new View({
        center: [0, 0], // 地图初始中心点（经纬度）
        zoom: 2, // 地图初始缩放级别
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
    if (geoJsonEntitis.length > 0) {


    }
})

// 测试数据库连接
$('#pgconnect').click(function () {
    // 判断结果不为空
    const dbres = fetchTables()
    console.log(dbres)
})


