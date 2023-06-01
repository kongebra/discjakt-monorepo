export interface Directive {
  type: string;
  value: string;
}

export interface UserAgentDirectives {
  [agent: string]: Directive[];
}

export const parseRobotsTxt = (content: string): UserAgentDirectives => {
  const lines = content.split("\n");
  let currentUserAgent = "";
  const robots: UserAgentDirectives = {};

  for (let line of lines) {
    line = line.trim().toLowerCase();
    if (line.startsWith("user-agent:")) {
      currentUserAgent = line.split(":")[1].trim();
      robots[currentUserAgent] = robots[currentUserAgent] || [];
    } else if (
      line.startsWith("allow:") ||
      line.startsWith("disallow:") ||
      line.startsWith("crawl-delay:")
    ) {
      const [type, value] = line.split(":");

      robots[currentUserAgent].push({
        type: type.trim(),
        value: value.trim(),
      });
    }
  }

  return robots;
};

export const getCrawlDelay = (
  robots: UserAgentDirectives,
  userAgent: string
): string => {
  const agentDirectives = robots[userAgent] || robots["*"];
  if (agentDirectives) {
    for (let directive of agentDirectives) {
      if (directive.type === "crawl-delay") {
        return directive.value;
      }
    }
  }

  return "0";
};
