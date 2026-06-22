// 本地占位：Next.js 在 SSR/SSG 阶段不会真正渲染远程自定义元素，
// 该组件仅在客户端由 site-footer.js 接管。

import React from "react";

interface ZanSiteFooterProps {
  theme?: "light" | "dark";
  "home-url"?: string;
  "link-text"?: string;
  text?: string;
}

export function ZanSiteFooter(props: ZanSiteFooterProps) {
  // 使用 createElement 绕过 TypeScript 对自定义标签的类型检查
  return React.createElement("zan-site-footer", props);
}
