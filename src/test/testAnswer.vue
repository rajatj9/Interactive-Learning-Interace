<template>
  <div>
    <div v-for="(value, index) in answers" :key="index" style="border: red;">
      <div> ID: {{ value.question_id }}</div>
      <div> value: {{ value.value }}</div>
      <div style="background: lightsteelblue; border: blue;"> answer_time:
        <ol>
          <li v-for="(item, i) in value.answer_time" :key="i">{{ item }}</li>
        </ol>
      </div>
      <!--<pre> operations: {{ value.operations }}</pre>-->
      <div style="background: lightgoldenrodyellow; border: orange;">operations:
        <ul>
          <li v-for="(item, k) in value.operations" :key="k">
            <pre>{{ item }}</pre>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
  import {mapGetters} from 'vuex';

  export default {
    computed: {
      ...mapGetters({
        answers: 'getAnswers'
      })
    }
  }
</script>