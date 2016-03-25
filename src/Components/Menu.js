import $ from 'jquery';
import Mustache from 'mustache';
import template from './Header.html';
import './Menu.scss';

export default class Menu {
    /**
     * 根据模板和数据, 渲染页面内容.
     * @param  {string} node 父节点的选择器
     */
    render(node) {
        const text = $(node).text(); // 这个comment是不对的

        $(node).html(Mustache.render(template, { text }));
    }
}