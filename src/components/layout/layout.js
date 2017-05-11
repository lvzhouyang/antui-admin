import React, { Component, PropTypes } from 'react';
import { Children, cloneElement } from 'react';
import { Layout, Icon } from 'antd';
import classNames from 'classnames';
import Drawer from './drawer';
import './style.less';
const { Header, Sider, Content, Footer } = Layout;
/**
 * 页面级整体布局
 */
class LayoutCmpt extends Component {
  static __LAYOUT = true;
  static propTypes = {
    /**
     * 间隔距离
     */
    gutter: PropTypes.number,
  };

  static defaultProps = {
    gutter: 0,
  };

  render() {
    const { gutter, embed, children } = this.props;
    let _isDrawer = false;
    let _drawerProps = {};
    const nodes = Children.map(children, (node) => {
      if (!node) {
        return null;
      }
      if (node.props && node.type && node.type.__DRAWER) {
        const { children, ...others } = node.props;
        _drawerProps = { ...others, drawerBody: children };
        _isDrawer = true;
      }
      if (node.props && node.type && gutter > 0) {
        let style = {};
        if (node.type.__LAYOUT) {
          return cloneElement(node, { style: { ...node.props.style, ...style }, gutter: gutter, embed: true });
        } else if (node.type.__HEADER) {
          style = { marginBottom: gutter };
        } else if (node.type.__FOOTER) {
          style = { marginTop: gutter };
        } else if (node.type.__SIDER) {
          style = { marginRight: gutter };
        }
        return cloneElement(node, { style: { ...node.props.style, ...style }, gutter: true });
      }
      return node;
    });
    const returnDOM = _isDrawer ? (
      <Drawer {..._drawerProps}>
        <Layout className="antui-layout" style={{padding: embed ? 0 : gutter}}>{ nodes }</Layout>
      </Drawer>
    ) : <Layout className="antui-layout" style={{padding: embed ? 0 : gutter}}>{ nodes }</Layout>;

    return returnDOM;
  }
}

class ExtendsCmpt extends Component {
  static propTypes = {
    gutter: PropTypes.bool,

  };
  static defaultProps = {
    gutter: false
  };

  _getClassName = (type) => {
    return classNames({
      [`antui-layout-${type}`]: true,
      'antui-layout-gutter': this.props.gutter
    });
  }
}

class HeaderCmpt extends ExtendsCmpt {
  static __HEADER = true;
  render() {
    const { children, style } = this.props;

    return (
      <Header className={this._getClassName('header')} style={style}>{ children }</Header>
    );
  }
}

class SiderCmpt extends ExtendsCmpt {
  static __SIDER = true;
  static __ANT_LAYOUT_SIDER = true;

  static propTypes = {
    collapsible: PropTypes.bool,
    width: PropTypes.number
  };

  static defaultProps = {
    collapsible: false,
    width: 200,
  };

  constructor(props) {
    super(props);
    this.state = {
      collapsed: false,
    };
  };

  toggle = () => {
    this.setState({
      collapsed: !this.state.collapsed,
    });
  };

  render() {
    const { children, gutter, ...others } = this.props;
    return (
      <Sider className={this._getClassName('sider')} {...others} collapsedWidth={0} trigger={null} collapsed={this.state.collapsed}>
        {
          this.props.collapsible ? (
            <span className="antui-layout-sider-trigger" onClick={this.toggle}>
              <Icon type={this.state.collapsed ? 'right' : 'left'} />
            </span>
          ) : null
        }
        { this.state.collapsed ? null : children }
      </Sider>
    );
  }
}

class ContentCmpt extends ExtendsCmpt {
  static __CONTENT = true;
  render() {
    const { children, style } = this.props;
    return (
      <Content className={this._getClassName('content')} style={style}>{ children }</Content>
    );
  }
}

class FooterCmpt extends ExtendsCmpt {
  static __FOOTER = true;
  render() {
    const { children, style } = this.props;
    return (
      <Footer className={this._getClassName('footer')} style={style}>{ children }</Footer>
    );
  }
}

class DrawerCmpt extends Component {
  static __DRAWER = true;
  render() {
    return null;
  }
}

LayoutCmpt.Header = HeaderCmpt;
LayoutCmpt.Sider = SiderCmpt;
LayoutCmpt.Content = ContentCmpt;
LayoutCmpt.Footer = FooterCmpt;
LayoutCmpt.Drawer = DrawerCmpt;

export default LayoutCmpt;