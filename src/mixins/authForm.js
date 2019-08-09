import {required, minLength, sameAs} from 'vuelidate/lib/validators';

export const authFormMixin = {
  data() {
    return {
      username: '',
      nameList: [],
      confirmUsername: '',
      isClickedButton: false
    }
  },
  computed: {
    isButtonDisable() {
      if (this.isClickedButton)
        return true;
      return (this.$v.$invalid && !this.isClickedButton);
    }
  },
  methods: {
    resetConfirmInput() {
      this.confirmUsername = '';
      this.isClickedButton = false;
    }
  },
  validations: {
    username: {
      required,
      minLen: minLength(5)
    },
    confirmUsername: {
      sameAs: sameAs('username')
    }
  }
}
