
<template>
  <div class="thanks-page">
    <result
          :subTitle="'Thank you for taking the survey!'" :score="result" 
          :maxScore="maxScore" :correctAnswers="correctAnswers" 
          :personalGoal="personalGoal" :pastPerformances="pastPerformances">
    </result>
   
  </div>
  
</template>

<script>
  import ResultsPage from '../components/ResultsPage.vue';

  export default {
    name: "ThankYou",
    components: {
      result: ResultsPage,

    },
    data: function() {
      return {
        result: 82,
        maxScore: 100,
        feedbackType: 1,
        correctAnswers: [
              { 'qno': 1, 'correctAnswer': "A", "correct": true, "mcq":true },
              { 'qno': 2, 'correctAnswer': "C",  "correct": false, "mcq": true},              
              { 'qno': 3, 'correctAnswer': "D", "correct": false, "mcq": true},
              { 'qno': 4, 'correctAnswer': "\\sqrt{2}^{2\\log_{2}{3}} = 3","correct": false, "mcq": false, 'formulaAnswer': true}
            ],
        pastPerformances: {
          'Quiz 1': 'B+',
          'Quiz 2': 'A-',
          'Quiz 3': 'A-'
        },
      personalGoal: 'A'
      }
    }
  }
</script>

<style scoped>
  .thanks-page {
    height: 100%;
    width: 100%;
  }

</style>