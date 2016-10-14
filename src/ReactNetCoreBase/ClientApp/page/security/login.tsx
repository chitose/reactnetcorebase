import * as React from 'react';
import { HttpClientConsumer } from '../../provider';
import * as authSvc from '../../service/auth';

interface LoginPageState {
  loginError: string;
}
export class LoginPage extends HttpClientConsumer<any, LoginPageState> {
  state = {
    loginError: ""
  };
  async submit(evt: React.FormEvent) {
    this.state.loginError = "";
    this.setState(this.state);

    evt.preventDefault();
    var resp = await authSvc.login(this.httpClient, { userName: "", password: "" });
    if (resp.isBusinessError) {
      this.state.loginError = this.i18n.t(resp.errorMessage, resp.errorOptions);
      this.setState(this.state);
    } else {
      console.log(resp.data);
    }
  }

  render() {
    return (
      <form onSubmit={this.submit.bind(this)}>
        <div>
          <input name="userName" required={true}/>
        </div>
        <div>
          <input name="password" type="password" required={true}/>
        </div>
        <div>
          <button type="submit">Login</button>
        </div>
        {this.state.loginError ? <p>{this.state.loginError}</p> : null}
      </form>
    );
  }
}