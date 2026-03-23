<template>
  <div>
    <pdf v-for="i in pages" ref="pdfs" :src="pdfUrl" :key="i" :page="i"></pdf>
  </div>
</template>

<script>
  import pdf from 'vue-pdf';
  import CMapReaderFactory from 'vue-pdf/src/CMapReaderFactory.js';

  export default {
    components: { pdf },
    props: {
      base64: String,
    },
    data() {
      return {
        pdfUrl: '',
        pages: [],
      };
    },

    mounted() {
      this.pdfData(); //调用方法
    },

    //获取pdf
    methods: {
      //接口获取pdf
      async pdfData() {
        console.log(this.base64);
        //需要转换为base64位 base64()是获取base64数据的
        this.pdfUrl = pdf.createLoadingTask(
          'data:application/pdf;base64,' + this.base64
        );

        const pd1 = await this.pdfUrl.promise;

        this.$nextTick(() => {
          this.pages = pd1.numPages;
        });
      },
    },
  };
</script>
