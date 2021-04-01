/*
 * @Author: zhouweixin 
 * @Date: 2020-07-16 15:29:50 
 * @Last Modified by: none
 * @Last Modified time: 2020-07-29 23:51:24
 */
<template>
  <div class="addItem_main" @click="handleChangeChecked">
    <van-checkbox name="" v-if="!hideChecked&&!showDel&&!noCheck" :value="checkedVal" ></van-checkbox>
    <div class="h" v-if="firstName">
      {{firstName}}
    </div>
    <div class="addItem_content">
      <p class="name">
        {{data.title}} <small v-if="data.email">id:({{data.id}})</small>
      </p>
      <p class="dep"> (id:{{data.id}})</p>
    </div>
    <van-icon v-if="checkedVal&&showDel" name="cross" color="#333333" @click="handleDel" />
  </div>
</template>

<script>
  export default {
    model: {
      prop: "checked",
      event: "input"
    },
    data() {
      return {
        checkedVal: this.checked
      }
    },
    watch: {
      checked(checked) {
        this.checkedVal = checked
      }
    },
    props: ['hideCheck','checked', 'data', 'delete','sim'],
    mounted() {},
    computed: {
      firstName() {
        return this.data.title?this.data.title.slice(0, 1):''
      },
      showDel() {
        if (this.delete === '') return true
        return false
      },
      noCheck(){
            if (this.sim === '') return true
        return false
      },
      hideChecked(){
          if (this.hideCheck == '') return true
        return false
      }
    },
    methods: {
      handleDel(){
        this.$emit("onDel",this.data)
      },
      handleChangeChecked() {
        if (this.showDel) {
          this.$emit("input", false)
          return
        }
        this.checkedVal = !this.checkedVal
        this.$emit("input", this.checkedVal)
        this.$emit('onChecked',this.data,this.checkedVal)
      }
    }
  }
</script>

<style scope>
  .addItem_main {
    width: 88%;
    margin: 0 auto;
    display: inline-block;
    align-items: center;
  }
  .h {
    display: inline-block;
    vertical-align: middle;
    text-align: center;
    font-size: 20px;
    line-height:40px;
    width: 40px;
    height: 40px;
    color: #fff;
    background: #d06053;
    border-radius: 50%;
    margin: 0 5px;
  }
  .name {
        display: block;
    word-break: break-all;
    margin: 5px 0;
    font-size: 20px;
  }
  .dep {
    color: #929292;
    margin: 5px 0;
    margin-top: 16px;
    font-size: 16px;
  }
  .addItem_content {
    width: 80%;
   display: inline-block;
    vertical-align: middle;
    flex: 1;
    line-height: .4rem;
  }
small{color: gray;}
</style>