export const kpopGroupsData = {
  groups: [
    ],
  };

  export type KpopGroup = (typeof kpopGroupsData.groups)[0];
  export type KpopMember = KpopGroup["members"][0];