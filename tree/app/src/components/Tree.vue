
<script>
  import Node from './Node';
  import {
    broadCastMixins
  } from './util';
  export default {
    name:"Tree",
          render() {
    let data = this.stateTree;
    let showCheckBox = this.showCheckBox;
    let loadData = this.loadData
    return (
      <div class={'tree'}>
        {data && data.length
          ? data.map((item, index) => {
              return (
                <Node
                  class={'tree-node'}
                  key={index}
                  data={item}
                  showCheckBox={showCheckBox}
                  loadData={loadData} 
                >
        
                           {/*这里是插槽*/}
                  {this.$scopedSlots.default} 
                </Node>
              );
            })
          : ''}
      </div>
    );
  },
    components: {
      Node
    },
    mixins: [broadCastMixins],
    data() {
      return {
        stateTree: this.data,
        flatTreeMap: {}
      };
    },
    props: {
      data: {
        // 外部传入的数据
        type: Array,
        default () {
          return [];
        }
      },
      showCheckBox: {
        // 配置项，是否显示checkbox
        type: Boolean,
        default: false
      },
      loadData: {
        // 配置项，异步加载数据的回调方法，
        type: Function
      }
    },
    watch: {
      data: {
        deep: true,
        handler() {
          this.stateTree = this.data
         
          this.flatTreeMap = this.transferFlatTree();
           this.updateCheckedNodesChildren()
        }
      }
    },
    methods: {
      transferFlatTree() {
        let keyCount = 0; // 定义一个key
        //treeArr为树形结构数组，parent为父级
        function flat(treeArr, parent = '') {
          //如果没有值,则返回空对象
          if (!treeArr && !treeArr.length) return {};
          // 因为我们要把数据格式化成一个哈希表结构，也就是对象，所以用了个reduce方便处理
          return treeArr.reduce((obj, cur) => {
            //cur就是数组当前的元素，是个对象，我们给他添加一个属性nodeKey，key的值为keyCount
            let nodeKey = keyCount;
            cur.nodeKey = nodeKey;
            //插入obj对象
            obj[nodeKey] = {
              nodeKey: keyCount,
              parent,
              // ...cur
              node: cur // 把当前节点赋值给属性node
            };
            // 为了保证每一个key都是唯一，每次都要累加
            keyCount++;
            if (cur.children && cur.children.length) {
              //如果有子节点 进行一次递归
              obj = { ...obj,
                ...flat(cur.children, cur)
              };
            }
            return obj;
          }, {});
        }
        return flat(this.stateTree); // 返回出格式化后的对象
      },
      updateCheckedNodesChildren() {
        // 获取勾选的节点，
        const checkedNodes = this.getCheckedNodes();
        checkedNodes.forEach((node) => {
          // 勾选的节点的子节点也进行勾选
          this.updateTreeDown(node.node, true);
          // 获取到所有已选节点的父几节点   
        //   const parentKey = this.flatTreeMap[node.nodeKey].parent.nodeKey;      
        //   // 如果为顶部节点则返回       
        //  if (!parentKey && parentKey !== 0) return; 
        //  //获取父几节点
        //   const parent = this.flatTreeMap[parentKey].node 
        //   // 如果当前节点已经勾选
        //   const childHasCheckSetter =
        //     typeof node.checked != 'undefined' && node.checked; 
        //     console.log(childHasCheckSetter && parent.checked != node.checked)
          // if (childHasCheckSetter && parent.checked != node.checked) { //如果父节点和子节点存在差异
          //   this.updateTreeUp(node.nodeKey); // update tree upwards
          // }
        });
      },
      updateTreeUp(nodeKey) {
        // 获取该节点parent节点的nodeKey
        const parentKey = this.flatTreeMap[nodeKey].parent.nodeKey;
        //如果没有则返回，递归停止判断，如果没有父级节点则不继续递归
        if (typeof parentKey == 'undefined') return;
        // 获取当前nodeKey的节点数据
        const node = this.flatTreeMap[nodeKey].node
        // 获取parent的节点数据
        const parent = this.flatTreeMap[parentKey].node
        // 如果勾选状态一样则返回，不用做任何操作
        if (node.checked == parent.checked) return;
        // 否则，当子节点有勾选时，判断他的同级节点是不是都是勾选状态，如果是，则父级节点勾选
        // 如果同级节点有些没有勾选，则返回falst,父级节点不勾选
        if (node.checked == true) {
          // 如果当前已勾选，则父几全部勾选
          this.$set(
            parent,
            'checked',
            parent['children'].every((node) => node.checked)
          );
        } else {
          // 如果当前节点不勾选则父级节点不勾选
          this.$set(parent, 'checked', false);
        }
        // 向上递归，直到根节点
        this.updateTreeUp(parentKey);
      },
      handleCheck(v) {
        if (!this.flatTreeMap[v.nodeKey]) return;
        const node = this.flatTreeMap[v.nodeKey]
        this.$set(node, 'checked', v.checked);
        this.updateTreeUp(v.nodeKey);
        this.updateTreeDown(v, v.checked);
        // 定义勾选方法
        this.$emit('onChecked', v);
      },
      handleSelect(v) {
        // 定义点击节点方法
        this.$emit('onSelect', v);
      },
      handleExpand(v) {
        // 定义点击展开方法
        this.$emit('onExpand', v);
      },
      getCheckedNodes() {
        // 获取勾选的节点
        return Object.values(this.flatTreeMap).filter(
          (item) => item.node.checked
        );
      },
      getCheckedChildrenNodes() {
        // 仅获取勾选的子节点
        return Object.values(this.flatTreeMap).filter(
          (item) => item.node.checked && !item.node.children
        );
      },
      // node为当前勾选的节点，checked为否勾选的值
      updateTreeDown(node, checked) {
        this.$set(node, 'checked', checked); // 先设置它的勾选状态
        if (node['children']) {
          // 如果有子节点
          node['children'].forEach((child) => {
            //则进行一次递归，让子节点也设置同样的勾选值
            this.updateTreeDown(child, checked);
          });
        }
      }
    },
    created() {
      this.on('handleCheck', this.handleCheck);
      this.on('handleSelect', this.handleSelect);
      this.on('handleExpand', this.handleExpand);

      this.flatTreeMap = this.transferFlatTree();
            this.updateCheckedNodesChildren()
    }
  };
</script>

<style>
  .tree-node {
    font-size: 30px;
    width: 90%;
    margin: 0 auto;
  }
</style>