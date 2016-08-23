var React = require('react');
var ReactRouter = require('react-router');
var Link = ReactRouter.Link;

function Login(props) {
  return (
    <div className="main-container">
      <nav className="navbar">
        <div className="navbar-header">
          <h1 className="navbar-brand"><Link to='/'>Street Food Finder</Link></h1>
        </div>
      </nav>
      <div className="inner-container login-form">
        <p>{props.errorMessage}</p>
        <button className="btn btn-facebook full-width" onClick={props.onFacebookLogin}>Sign In with Facebook</button>
        <button className="btn btn-google full-width" onClick={props.onGoogleLogin}>Sign In with Google</button>
        <hr />
        <form onSubmit={props.onSubmitUser}>
          <div className="form-group">
            <input type="email" name="email" id="email" className="form-control top" placeholder="Email" value={props.email} onChange={props.onUpdateEmail} />
          </div>
          <div className="form-group">
            <input type="password" name="password" id="password" className="form-control bottom" placeholder="Password" value={props.password} onChange={props.onUpdatePassword} />
          </div>
          <button type="submit" className="btn btn-success full-width">Sign In</button>
        </form>
      </div>
    </div> 
  )
}

module.exports = Login;