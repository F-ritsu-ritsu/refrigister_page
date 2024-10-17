import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';

const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [errorMessage, setErrorMessage] = useState(''); // エラーメッセージ用のステート
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const loginData = {
      email,
      password,
      username,
    };

    try {
      const response = await fetch('http://takaryo1010.site:8080/users/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'accept': 'application/json',
        },
        body: JSON.stringify(loginData),
      });

      if (!response.ok) {
        throw new Error('ログインに失敗しました');
      }

      const data = await response.json();
      console.log('ログイン成功:', data);
      
      // ログイン成功後にホームページへリダイレクト
      navigate('/');
    } catch (error) {
      console.error('エラー:', error);
      setErrorMessage('ログインに失敗しました。<br />メールアドレスまたはパスワードが正しくありません。'); // エラーメッセージを設定
    }
  };

  return (
    <div className="login-container">
      <h2>ログイン</h2>
      {errorMessage && (
        <div
          className="error-message"
          dangerouslySetInnerHTML={{ __html: errorMessage }} // HTMLとしてエラーメッセージをレンダリング
        />
      )}
      <form onSubmit={handleSubmit}>
        <div>
          <p>Email:</p>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <p>パスワード:</p>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <div>
          <p>ユーザ名:</p>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <button type="submit">ログイン</button>
      </form>

      
    </div>
  );
};

export default LoginForm;
