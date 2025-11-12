import { type RouteConfig, index ,route} from "@react-router/dev/routes";

export default [index("routes/home.tsx"),
    route("/about", "routes/about.tsx"),
    route("/news", "routes/financial-news.tsx"),
    route("/startups", "routes/startups.tsx"),
    route("/login", "routes/auth.tsx"),
    route("/user-management", "routes/users.tsx"),
    route("/data-management", "routes/data.tsx"),
] satisfies RouteConfig;
