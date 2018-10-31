// echarts图表js代码
$(function(){
 // 柱状图
 // 基于准备好的dom，初始化echarts实例
 var echartsLeft = echarts.init(document.querySelector('.echarts_left'));

// 指定图表的配置项和数据
var option1 = {
  // 指定图表的大标题
    title: {      
        text: '2017年注册人数'
    },
    // 提示框组件
    tooltip: {},
    // 图例，用于解释说明的
    legend: {
        data:['人数','销量']
    },
    //x轴坐标的信息
    xAxis: {
        data: ["1月","2月","3月","4月","5月","6月"]
    },
    // y轴坐标的信息
    yAxis: {},
    series: [{
        name: '人数',
      // type: 设置图表的类型   bar 柱状图  line 折线图 pie 饼图
        type: 'bar',
        data: [500, 202, 360, 1000, 800, 600]
    },
    
  ]
};

// 使用刚指定的配置项和数据显示图表。
echartsLeft.setOption(option1);



// 基于准备好的dom，初始化echarts实例
var echartsRight = echarts.init(document.querySelector('.echarts_right'));

// 指定图表的配置项和数据
option2 = {
  // 指定饼图的大标题
  title : {
    // 饼图标题文本
      text: '热门品牌销售',
      // 副标题文本
      subtext: '2018年10月',
      // 标题在水平方向上的对齐方式：居左，居右，居中
      x:'center',
      // 标题样式
      textStyle: {
        // 可以配置颜色，字体大小，字体，字体风格（正常，斜体），字体加粗
        color: '#444',
        fontSize: 25,
      }
  },
  // 饼图提示框组件
  tooltip : {
    // 在饼图中，鼠标移上某一块区域时，显示相当于的提示内容
      trigger: 'item',
      // {a}（系列名称），{b}（数据项名称），{c}（数值）, {d}（百分比）
      formatter: "{a} <br/>{b} : {c} ({d}%)"
  },
  // 图例，用于解释说明的
  legend: {
    // 图例的排列方式，是水平方向上还是垂直方向上 ，horizontal 水平的， vertical 垂直的
      orient: 'vertical',
      // 对齐方式：居左，居中，居右
      left: 'left',
      //数据分类信息 
      data: ['耐克','阿迪','新百伦','李宁','阿迪王']
  },

  // 系列
  series : [
      {
          name: '品牌',
          // 图表类型，饼图
          type: 'pie',
          // 圆的直径大小
          radius : '55%',
          // 圆心坐标位置
          center: ['50%', '60%'],
          //数据分类信息
          data:[
              {value:335, name:'耐克'},
              {value:310, name:'阿迪'},
              {value:234, name:'新百伦'},
              {value:135, name:'李宁'},
              {value:1548, name:'阿迪王'}
          ],
           // 阴影效果
          itemStyle: {
              emphasis: {
                // 阴影模糊程度
                  shadowBlur: 30,
                  // 阴影水平偏移
                  shadowOffsetX: 0,
                  // 阴影颜色
                  shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
          }
      }
  ]
};


// 使用刚指定的配置项和数据显示图表。
echartsRight.setOption(option2);


});