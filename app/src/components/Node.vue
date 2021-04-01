<script>
import { broadCastMixins } from './util';
export default {
  name: 'Node', // 这个很关键，递归组件必须有name
  render() {
    let showCheckBox = this.showCheckBox;
    let data = this.data;
    let loadData = this.loadData
    return (
      <div>
        <ul class={'tree-ul'}>
          <li class={'tree-li'} onClick={(e) => this.handleSelect(e)}>
            {showCheckBox && (
              <van-checkbox
                class={'checkbox'}
                icon-size={'18px'}
                value={data.checked}
                onClick={(e) => this.handleCheck(e, data)}
              />
            )}

            {/*如果没有插槽则默认使用显示内容*/}

            {this.$scopedSlots.default ? (
              this.$scopedSlots.default({
                data: data
              })
            ) : (
              <span>{data.title}</span>
            )}
            <span class={'tree-expand'}>
              {this.showLoading ? (
                <van-loading class={'tree-loading'} color={'#1989fa'} />
              ) : (
                ''
              )}
              {this.showArrow ? (
                <van-icon
                  name={this.arrowType}
                  onClick={(e) => this.handleExpand(e)}
                />
              ) : (
                ''
              )}
            </span>
            {data.expand &&
              data.children.map((item, index) => {
                return (
                  <Node key={index} data={item} showCheckBox={showCheckBox} loadData={loadData}>
                    {this.$scopedSlots.default}
                  </Node>
                );
              })}
          </li>
        </ul>
      </div>
    );
  },
  props: {
    data: {
      type: Object,
      default() {
        return {};
      }
    },
    showCheckBox: {
      type: Boolean,
      default: false
    },
    loadData: {
      type: Function
    }
  },
  mixins: [broadCastMixins],
  computed: {
    showArrow() {
      // 1.如果数据没有children，说明是子组件，就不用展示下拉箭头
      // 2.如果开启了异步加载，在loading的时候，不显示箭头
      return (
        (this.data.children &&
          this.data.children.length &&
          !this.showLoading) ||
        (this.data.children &&
          !this.data.children.length &&
          this.loadData &&
          !this.showLoading)
      );
    },
    showLoading() {
      // 判断是否有loading属性，并且判断你是否在开启状态
      return 'loading' in this.data && this.data.loading;
    },
    arrowType() {
      //箭头方向,van组件提供的属性
      return this.showArrow && this.data.expand ? 'arrow-down' : 'arrow';
    }
  },
  methods: {
    handleCheck(e) {
          e.cancelBubble = true;
      this.$set(this.data, 'checked', !this.data.checked);
      this.broadCast('handleCheck', this.data);
    }, //勾选方法
    handleExpand(e) {
          e.cancelBubble = true;
      let node = this.data;
      if (node.children && node.children.length === 0) {
        if (this.loadData) {
          this.$set(node, 'loading', true); // 显示loading
          this.loadData(node, (arr, callback) => {
            // 这个loadData回调函数，由外部组件调用的时候传入arr和callback
            if (arr.length) {
              // 如果外部传入的数组不为空
              // 把arr作为当前父级节点的children
              this.$set(node, 'children', arr);
              this.$nextTick(() => {
                //展开操作
                this.handleExpand(e);
                //执行外部传入的回调函数，成功的时候
                callback('suc', node);
              });
            } else {
              // 如果返回的是为空数组，则执行失败的回调
              callback('falid');
            }
            this.$set(node, 'loading', false); //关闭loading
          });
        }
        return;
      }
      this.$set(this.data, 'expand', !this.data.expand);
      this.broadCast('handleExpand', this.data);
    },
    handleSelect(e) {
     e.cancelBubble = true;
      this.broadCast('handleSelect', this.data);
    } //点击列表
  },

};
</script>

<style>
.tree-ul,
.tree-li {
  font-size: 20px;
  list-style: none;
  margin-left: 10px;
  position: relative;
  height: auto;
}
.tree-ul {
  margin: 15px auto;
  box-sizing: border-box;
}
.tree-li {
  position: relative;
  width: 100%;
  box-sizing: border-box;
  margin: 6px 3px;
  padding-right: 3px;
  padding-left: 10px;
}
.tree-expand {
  height: 20px;
  cursor: pointer;
  position: absolute;
  top: 4px;
  right: 0;
  margin: auto;
}
.checkbox {
  display: inline-block !important;
  vertical-align: middle;
  margin-right: 4px;
}
.tree-loading {
  width: 20px;
  height: 20px;
  position: absolute;
  top: 0;
  right: 0;
  margin: auto;
}
</style>
