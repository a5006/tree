<template>
  <div id="app">
    <Tree
      :data="data"
      :showCheckBox="true"
      @onChecked="handleChecked"
      @onExpand="handleExpand"
      @onSelect="hanldeSelect"
      :loadData="handleLoadData"
      ref="tree"
    >
      <template v-slot="slotProps">
        <span v-if="slotProps.data.depCount >= 0"
          >{{ slotProps.data.title }}
        </span>
        <AddrItem
          v-else
          class="addrItem"
          :key="slotProps.data.id"
          :data="slotProps.data"
          sim
        />
      </template>
    </Tree>
<div class="flex">
    <van-button type="primary" @click="getCheckedNodes">获取checkedNodes</van-button>
    <van-button  type="primary" @click="getCheckedChildrenNodes">获取checkedChildNodes</van-button>

</div>
  </div>
</template>

<script>
import Tree from './components/Tree';
import AddrItem from './AddrItem';
export default {
  components: {
    AddrItem,
    Tree
  },
  data() {
    return {
      list: [
        {
          id: 1,
          parentId: 0,
          title: '公司',
          depCount: 11
        },
        {
          id: 4,
          parentId: 1,
          title: '开发一部',
          depCount: 1
        },
        {
          id: 2,
          parentId: 1,
          title: '开发二部',
          depCount: 4
        },
        {
          id: 5,
          parentId: 3,
          title: '前端组',
          depCount: 1
        },
        {
          id: 3,
          parentId: 1,
          title: '开发三部',
          depCount: 3
        },
        {
          id: 6,
          parentId: 3,
          title: '后端组',
          depCount: 0
        },
        {
          id: 7,
          parentId: 4,
          title: '爆破组',
          depCount: 0
        },
        {
          id: 8,
          parentId: 2,
          title: '测试组',
          depCount: 0
        },
        {
          id: 9,
          parentId: 2,
          title: '运维组',
          depCount: 2
        },
        {
          id: 10,
          parentId: 9,
          title: '西岚'
        },
        {
          id: 11,
          parentId: 9,
          title: '东岚'
        },
        {
          id: 12,
          parentId: 5,
          title: '南岚'
        }
      ]
    };
  },
  methods: {
    getCheckedNodes() {
      console.log(this.$refs.tree.getCheckedNodes());
    },
    getCheckedChildrenNodes() {
      console.log(this.$refs.tree.getCheckedChildrenNodes());
    },
    formatTree(arr) {
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
    },
    handleChecked(v) {
      console.log(v, 'checked');
    },
    handleExpand(v) {
      console.log(v, 'expand');
    },
    hanldeSelect(v) {
      console.log(v, 'select');
    },
    deepCopy(data) {
      if (data == null) return;
      let typeOf = (d) => {
        return Object.prototype.toString.call(d);
      };
      let o = null;
      if (typeOf(data) === '[object Object]') {
        o = {};
        for (let k in data) {
          o[k] = this.deepCopy(data[k]);
        }
      } else if (typeOf(data) === '[object Array]') {
        o = [];
        for (let i = 0; i < data.length; i++) {
          o.push(this.deepCopy(data[i]));
        }
      } else {
        return data;
      }
      return o;
    },
    handleLoadData(node, callback) {
      setTimeout(() => {
        callback(
          [...new Array(Math.floor(Math.random() * 10) + 1).keys()].map(() => {
            return {
              id: new Date().getTime(),
              parentId: node.id,
              title: [
                '北岚',
                '测试狗',
                '尤玉溪门徒',
                '狂躁的韭菜',
                '前端bb机',
                '前端狂魔',
                '鱿鱼溪',
                '普通的章鱼🐙',
                '狂暴🌲人',
                '鱿鱼🦑冬'
              ][Math.floor(Math.random() * 9)],
              children: [],
              depCount: Math.floor(Math.random() * 10) + 1
            };
          }),
          (res) => {
            if (res == 'suc') {
              console.log('加载成功');
            }
          }
        );
      }, 500);
    }
  },
  computed: {
    data() {
      return this.formatTree(this.depData);
    }
  },
  created() {
    this.depData = this.deepCopy(this.list).map((item) => {
      if (item.depCount != null) {
        item.children = [];
      }
      item.checked = false;
      item.expand = false;
      return item;
    });
  }
};
</script>

<style>
html,
body {
  width: 100%;
  height: 100%;
  margin: 0;
}
#app {
  position: relative;
  width: 100%;
  height: 100%;
  padding-top: 100px;
}
.flex{
  display: flex;
  justify-content: space-around;
}
</style>
