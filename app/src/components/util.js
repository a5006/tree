/**
 *  发布订阅模式，
 *  消息发布中心
 * @class BroadCast
 */
class BroadCast {
  constructor() {
    this.listMap = {}; // 存储监听者
  }
  emit(k, v) {
    // 发布消息函数,k为监听者的key，v为需要传值的value
    this.listMap[k] &&
      this.listMap[k].map((fn) => {
        fn.call(null, v);
      });
  }
  on(k, fn) {
    // 添加监听者,,k为监听者的key，fn为执行的回调函数
    if (!this.listMap[k]) {
      this.listMap[k] = [];
    }
    this.listMap[k].push(fn);
  }
}

const broadCast = new BroadCast();
export const broadCastMixins = {
  methods: {
    // 定义broadcast发布消息方法
    broadCast(k, v) {
      broadCast.emit(k, v);
    },
    on(k, fn) {
      // 定义接收消息方法
      broadCast.on(k, fn);
    }
  }
};

export const formatTree = (arr) => {
  console.log(arr);
  // 有可能存在多个最外层的父级节点，先把他们找出来
  function findParents(arr) {
    // arr为原数组
    //通过reduce方法把数组转换成对象，作为一个哈希表（说白了就是个对象）存储他们的id
    const map = arr.reduce((obj, cur) => {
      let id = cur['id']; // 获取每一项的id
      obj[id] = id;
      return obj;
    }, {});
    // 最后做一次筛选，找出最外层的父级节点数据
    return arr.filter((item) => !map[item.parentId]);
  }
  let parents = findParents(arr); // 获取最外层父级节点
  // 查找每个parents 对应的子孙节点，此处开始递归
  function findChildren(parents) {
    if (!parents) return;
    parents.forEach((p) => {
      arr.forEach((item) => {
        // 如果原数组arr里面的每一项中的parentId恒等于父级的某一个节点的id，则把它推进父级的children数组里面
        if (p.id === item.parentId) {
          if (!p.children) {
            p.children = [];
          }
          p.children.push(item);
        }
      });
      // 最后进行一次递归，找儿子们的儿子们
      findChildren(p.children);
    });
  }
  findChildren(parents);
  return parents;
};
