import React from 'react';

import { Layout, Menu, Breadcrumb, Button } from 'antd';
import { UserOutlined, LaptopOutlined, NotificationOutlined } from '@ant-design/icons';
import Icon from '@ant-design/icons';

import changeTheme from 'next-dynamic-antd-theme';

const { SubMenu } = Menu;
const { Header, Content, Sider } = Layout;

interface IndexPageProps {}
interface IndexPageState {
  theme: 'default' | 'dark';
}

class IndexPage extends React.Component<IndexPageProps, IndexPageState> {
  constructor(props: IndexPageProps) {
    super(props);
    this.state = {
      theme: 'default',
    };
  }

  renderLight = props => (
    <div
      dangerouslySetInnerHTML={{
        __html: `
   <svg width="1em" height="1em" viewBox="0 0 21 21">
      <g fill="none" fill-rule="evenodd">
        <path
          fill="#222"
          fill-rule="nonzero"
          d="M21 10.5l-3 3V18h-4.5l-3 3-3-3H3v-4.5l-3-3 3-3V3h4.5l3-3 3 3H18v4.5z"
        ></path>
        <circle stroke="#FFF" stroke-width="1.5" cx="10.5" cy="10.5" r="4"></circle>
      </g>
    </svg>
        `,
      }}
    />
  );
  renderDark = props => (
    <div
      dangerouslySetInnerHTML={{
        __html: `
   <svg width="1em" height="1em" viewBox="0 0 21 21">
      <g fill="none" fill-rule="evenodd">
        <circle fill="#222" cx="10.5" cy="10.5" r="10.5"></circle>
        <path
          d="M13.396 11c0-3.019-1.832-5.584-4.394-6.566A6.427 6.427 0 0111.304 4C15.002 4 18 7.135 18 11c0 3.866-2.998 7-6.698 7A6.42 6.42 0 019 17.566c2.564-.98 4.396-3.545 4.396-6.566z"
          fill="#FFF"
          fill-rule="nonzero"
        ></path>
      </g>
    </svg>
        `,
      }}
    />
  );
  render() {
    return (
      <Layout style={{ minHeight: '100vh' }}>
        <Header className="header">
          <div className="logo" />
          <Menu
            theme="dark"
            mode="horizontal"
            defaultSelectedKeys={['2']}
            style={{ lineHeight: '64px' }}
          >
            <Menu.Item key="1">nav 1</Menu.Item>
            <Menu.Item key="2">nav 2</Menu.Item>
            <Menu.Item key="3">nav 3</Menu.Item>
          </Menu>
        </Header>
        <Layout>
          <Sider width={200} className="site-layout-background">
            <Menu
              mode="inline"
              defaultSelectedKeys={['1']}
              defaultOpenKeys={['sub1']}
              style={{ height: '100%', borderRight: 0 }}
            >
              <SubMenu
                key="sub1"
                title={
                  <span>
                    <UserOutlined />
                    subnav 1
                  </span>
                }
              >
                <Menu.Item key="1">option1</Menu.Item>
                <Menu.Item key="2">option2</Menu.Item>
                <Menu.Item key="3">option3</Menu.Item>
                <Menu.Item key="4">option4</Menu.Item>
              </SubMenu>
              <SubMenu
                key="sub2"
                title={
                  <span>
                    <LaptopOutlined />
                    subnav 2
                  </span>
                }
              >
                <Menu.Item key="5">option5</Menu.Item>
                <Menu.Item key="6">option6</Menu.Item>
                <Menu.Item key="7">option7</Menu.Item>
                <Menu.Item key="8">option8</Menu.Item>
              </SubMenu>
              <SubMenu
                key="sub3"
                title={
                  <span>
                    <NotificationOutlined />
                    subnav 3
                  </span>
                }
              >
                <Menu.Item key="9">option9</Menu.Item>
                <Menu.Item key="10">option10</Menu.Item>
                <Menu.Item key="11">option11</Menu.Item>
                <Menu.Item key="12">option12</Menu.Item>
              </SubMenu>
            </Menu>
          </Sider>
          <Layout style={{ padding: '0 24px 24px' }}>
            <Breadcrumb style={{ margin: '16px 0' }}>
              <Breadcrumb.Item>Home</Breadcrumb.Item>
              <Breadcrumb.Item>List</Breadcrumb.Item>
              <Breadcrumb.Item>App</Breadcrumb.Item>
            </Breadcrumb>
            <Content
              className="site-layout-background"
              style={{
                padding: 24,
                margin: 0,
                minHeight: 280,
              }}
            >
              <Button
                shape="circle"
                size="large"
                onClick={() => {
                  const theme = this.state.theme == 'default' ? 'dark' : 'default';
                  this.setState({ theme }, () => {
                    changeTheme(theme);
                  });
                }}
              >
                <Icon
                  component={this.state.theme == 'default' ? this.renderLight : this.renderDark}
                />
              </Button>
              <Button
                size="large"
                onClick={() => {
                  changeTheme({ '@primary-color': '#ff0000' });
                }}
              >
                红色主题色
              </Button>
            </Content>
          </Layout>
        </Layout>
      </Layout>
    );
  }
}

export default IndexPage;
