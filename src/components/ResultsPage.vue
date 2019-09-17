<template>
  <div class="message-wrapper">
    <div class="message-container">
      <div class="message-title"> <p>Your Score is </p> <p>{{ score }} / {{ maxScore }}! </p></div>
     
      <b-progress :value="score" class="mb-3"></b-progress>
     
     <div class="row">

      <div class="column">
        <div class="message-subtitle"><strong>Correct Answers</strong></div>
        <ul class="answer-list">
          <li v-for="answer in correctAnswers" v-bind:key="answer.qno">
            <strong>Question {{ answer.qno }}. </strong> 
            <katex-element v-if="answer.formulaAnswer" v-bind:expression="answer.correctAnswer"/>
            <font color="green" v-if="answer.correct && answer.mcq">{{ answer.correctAnswer }} </font>
            <font color="red" v-if="!answer.correct && answer.mcq">{{ answer.correctAnswer }} </font>
          </li>
        </ul>
      </div>

      <div class="column">
        <div class="message-subtitle"><strong>Past Performances</strong></div>
        <ul class="answer-list">
          <li v-for="(grade, quiz) in pastPerformances" v-bind:key="quiz">
            <strong> {{ quiz }}: </strong> {{ grade }}
            
          </li>
        </ul>
      </div>

     </div>

      <div class="personal-goal" v-if="personalGoal">Personal Goal: {{ personalGoal }} </div>
      <div class="message-subtitle">{{ subTitle }}</div>
      
    </div>
  </div>
</template>

<script>
  export default {
    name: "ResultsPage",
    props: {
      title: {
        type: String,
        required: false,
        default: "Message",
      },
      subTitle: {
        type: String,
        required: false,
        default: ""
      },
      score: {
        type: Number
      },
      correctAnswers: {
        type: Array
      },
      maxScore: {
        type: Number
      },
      personalGoal: {
        type: String
      },
      pastPerformances: {
        type: Object
      }
    }
  }
</script>

<style scoped>
  .message-wrapper {
    height: 100%;
    width: 100%;
    background: url("../assets/img/message_bg-min.png") no-repeat center;
    display: flex;
    -ms-flex-align: center;
    -ms-flex-pack: center;
    -webkit-box-align: center;
    align-items: center;
    -webkit-box-pack: center;
    justify-content: center;
    padding-top: 40px;
    padding-bottom: 40px;
    z-index: 10;
  }

  @media screen and (orientation: portrait) {
    .message-wrapper {
      background-size: 300% auto;
    }
  }

  @media screen and (orientation: landscape) {
    .message-wrapper {
      background-size: auto 120%;
    }
  }

  .message-container {
    width: 100%;
    max-width: 530px;
    padding: 15px;
    margin: 0 auto;
  }

  .message-title {
    font-size: 36px;
    font-weight: bold;
    /*text-transform: uppercase;*/
    /*background: linear-gradient(to right, #A66EDF 0%, #4E8FDF 100%);*/
    background: linear-gradient(150deg, #A66EDF -5%, #4E8FDF 105%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    font-family: "Poppins", sans-serif;
    text-shadow: 0px 2px 5px rgba(74, 144, 226, 0.65);
  }

  .message-subtitle {
    margin-top: 1rem;
    font-size: 20px;
    color: #9B9B9B;
  }
    .personal-goal {
    margin-top: 1rem;
    font-size: 20px;
    color: #4E8FDF;
  }
  .answer-list {
  list-style-type: none;
  color: #9B9B9B;
 }

 .row {
  display: flex;
}

.column {
  flex: 50%;
}
</style>