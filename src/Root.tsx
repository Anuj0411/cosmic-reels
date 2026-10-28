import type { FC } from "react";
import { Composition } from "remotion";
import { CosmicVideo, cosmicSchema, type CosmicProps } from "./compositions/CosmicVideo";
import { NebulaFly, nebulaSchema, type NebulaFlyProps } from "./compositions/NebulaFly";
import type { Flight } from "./lib/flights";
import type { StillId } from "./lib/stills";

const REEL = { fps: 30, durationInFrames: 450, width: 1080, height: 1920 };

const nebulaBase: Omit<
  NebulaFlyProps,
  "stillId" | "flight" | "zoom" | "meteors" | "travelStars" | "bank"
> = {
  title: "",
  showCredit: false,
  depth: 1,
  focusX: 0,
  focusY: 0,
};

const nebulaShots: Array<{
  id: string;
  stillId: StillId;
  flight: Flight;
  zoom: number;
  meteors?: boolean;
  travelStars?: boolean;
  bank?: number;
}> = [
  { id: "NebulaFly", stillId: "n49", flight: "push", zoom: 1.7, travelStars: true },
  { id: "N49Reveal", stillId: "n49", flight: "pull", zoom: 1.9, travelStars: true },
  {
    id: "SouthernCrabOrbit",
    stillId: "southern-crab",
    flight: "orbit",
    zoom: 1.45,
    travelStars: true,
    bank: 0.24,
  },
  {
    id: "StarNurseryRise",
    stillId: "star-nursery",
    flight: "rise",
    zoom: 1.35,
    travelStars: true,
  },
  { id: "Snr0519Punch", stillId: "snr-0519", flight: "punch", zoom: 2.45, travelStars: true },
  {
    id: "Snr1006Track",
    stillId: "snr-1006",
    flight: "track",
    zoom: 1.85,
    travelStars: true,
    bank: -0.16,
  },
  {
    id: "M82Glide",
    stillId: "m82",
    flight: "glide",
    zoom: 1.55,
    travelStars: true,
    bank: -0.18,
  },
];

const deepShots: Array<{
  id: string;
  stillId: StillId;
  flight: Flight;
  zoom: number;
  travelStars?: boolean;
  bank?: number;
}> = [
  { id: "Andromeda", stillId: "andromeda", flight: "track", zoom: 1.7, travelStars: true, bank: 0.08 },
  { id: "Antennae", stillId: "antennae", flight: "orbit", zoom: 1.5, travelStars: true, bank: 0.18 },
  { id: "Arp273", stillId: "arp-273", flight: "pull", zoom: 1.55, travelStars: true },
  { id: "Bubble", stillId: "bubble", flight: "rise", zoom: 1.55, travelStars: true, bank: 0.1 },
  { id: "Butterfly", stillId: "butterfly", flight: "glide", zoom: 1.5, travelStars: true, bank: -0.2 },
  { id: "Carina", stillId: "carina", flight: "glide", zoom: 1.4, travelStars: true, bank: -0.16 },
  { id: "Cartwheel", stillId: "cartwheel", flight: "pull", zoom: 1.5, travelStars: true },
  { id: "CatsEye", stillId: "cats-eye", flight: "orbit", zoom: 1.6, travelStars: true, bank: 0.22 },
  { id: "CosmicCliffs", stillId: "cosmic-cliffs", flight: "track", zoom: 1.5, travelStars: true, bank: 0.14 },
  { id: "CrabNebula", stillId: "crab-nebula", flight: "orbit", zoom: 1.55, travelStars: true, bank: 0.2 },
  { id: "Helix", stillId: "helix", flight: "push", zoom: 1.6, travelStars: true },
  { id: "HoagsObject", stillId: "hoags-object", flight: "punch", zoom: 1.7, travelStars: true },
  { id: "Horsehead", stillId: "horsehead", flight: "rise", zoom: 1.7, travelStars: true },
  { id: "Hourglass", stillId: "hourglass", flight: "punch", zoom: 1.85, travelStars: true },
  { id: "JupiterAurora", stillId: "jupiter-aurora", flight: "orbit", zoom: 1.7, travelStars: true, bank: 0.24 },
  { id: "JwstDeepField", stillId: "jwst-deep-field", flight: "rise", zoom: 1.5, travelStars: true },
  { id: "JwstPillars", stillId: "jwst-pillars", flight: "rise", zoom: 1.4, travelStars: true, bank: 0.12 },
  { id: "Lagoon", stillId: "lagoon", flight: "track", zoom: 1.55, travelStars: true, bank: 0.1 },
  { id: "M101", stillId: "m101", flight: "push", zoom: 1.45, travelStars: true },
  { id: "M81", stillId: "m81", flight: "orbit", zoom: 1.5, travelStars: true, bank: 0.18 },
  { id: "Mice", stillId: "mice", flight: "glide", zoom: 1.55, travelStars: true, bank: -0.12 },
  { id: "MysticMountain", stillId: "mystic-mountain", flight: "punch", zoom: 1.8, travelStars: true, bank: -0.1 },
  { id: "Neptune", stillId: "neptune", flight: "pull", zoom: 1.55, travelStars: true },
  { id: "Ngc1300", stillId: "ngc-1300", flight: "glide", zoom: 1.5, travelStars: true, bank: -0.16 },
  { id: "Ngc3603", stillId: "ngc-3603", flight: "punch", zoom: 1.7, travelStars: true },
  { id: "Ngc602", stillId: "ngc-602", flight: "pull", zoom: 1.45, travelStars: true },
  { id: "OmegaCentauri", stillId: "omega-centauri", flight: "punch", zoom: 1.8, travelStars: true },
  { id: "Orion", stillId: "orion", flight: "orbit", zoom: 1.45, travelStars: true, bank: 0.2 },
  { id: "PhantomGalaxy", stillId: "phantom-galaxy", flight: "orbit", zoom: 1.45, travelStars: true, bank: 0.2 },
  { id: "PillarsCreation", stillId: "pillars-creation", flight: "push", zoom: 1.55, travelStars: true },
  { id: "RedSpider", stillId: "red-spider", flight: "track", zoom: 1.65, travelStars: true },
  { id: "RingNebula", stillId: "ring-nebula", flight: "pull", zoom: 1.7, travelStars: true },
  { id: "Saturn", stillId: "saturn", flight: "track", zoom: 1.6, travelStars: true, bank: 0.12 },
  { id: "Sombrero", stillId: "sombrero", flight: "track", zoom: 1.55, travelStars: true, bank: 0.12 },
  { id: "SouthernRing", stillId: "southern-ring", flight: "orbit", zoom: 1.5, travelStars: true, bank: 0.16 },
  { id: "StephansQuintet", stillId: "stephans-quintet", flight: "orbit", zoom: 1.4, travelStars: true, bank: 0.16 },
  { id: "Tadpole", stillId: "tadpole", flight: "track", zoom: 1.6, travelStars: true, bank: 0.1 },
  { id: "Tarantula", stillId: "tarantula", flight: "push", zoom: 1.5, travelStars: true },
  { id: "UltraDeepField", stillId: "ultra-deep-field", flight: "push", zoom: 1.55, travelStars: true },
  { id: "Veil", stillId: "veil", flight: "glide", zoom: 1.5, travelStars: true, bank: -0.14 },
  { id: "Westerlund2", stillId: "westerlund-2", flight: "orbit", zoom: 1.5, travelStars: true, bank: 0.18 },
  { id: "Whirlpool", stillId: "whirlpool", flight: "orbit", zoom: 1.45, travelStars: true, bank: 0.22 },
  { id: "Abell370", stillId: "abell-370", flight: "rise", zoom: 1.5, travelStars: true },
  { id: "Arp107", stillId: "arp-107", flight: "glide", zoom: 1.65, travelStars: true, bank: -0.12 },
  { id: "Arp143", stillId: "arp-143", flight: "track", zoom: 1.55, travelStars: true, bank: 0.1 },
  { id: "CasA", stillId: "cas-a", flight: "orbit", zoom: 1.55, travelStars: true, bank: 0.2 },
  { id: "CatsPaw", stillId: "cats-paw", flight: "push", zoom: 1.5, travelStars: true },
  { id: "CentaurusA", stillId: "centaurus-a", flight: "orbit", zoom: 1.45, travelStars: true, bank: 0.16 },
  { id: "Chameleon", stillId: "chameleon", flight: "glide", zoom: 1.55, travelStars: true, bank: -0.14 },
  { id: "ConeNebula", stillId: "cone-nebula", flight: "rise", zoom: 1.6, travelStars: true },
  { id: "EagleNebula", stillId: "eagle-nebula", flight: "orbit", zoom: 1.45, travelStars: true, bank: 0.18 },
  { id: "Eskimo", stillId: "eskimo", flight: "punch", zoom: 1.75, travelStars: true },
  { id: "Hh211", stillId: "hh-211", flight: "rise", zoom: 1.55, travelStars: true, bank: 0.1 },
  { id: "Hh46", stillId: "hh-46", flight: "track", zoom: 1.55, travelStars: true, bank: 0.12 },
  { id: "Ic348", stillId: "ic-348", flight: "rise", zoom: 1.5, travelStars: true },
  { id: "Jellyfish", stillId: "jellyfish", flight: "pull", zoom: 1.55, travelStars: true },
  { id: "LobsterNebula", stillId: "lobster-nebula", flight: "orbit", zoom: 1.4, travelStars: true, bank: 0.16 },
  { id: "M106", stillId: "m106", flight: "glide", zoom: 1.5, travelStars: true, bank: -0.16 },
  { id: "Mayall", stillId: "mayall", flight: "punch", zoom: 1.7, travelStars: true },
  { id: "N79", stillId: "n79", flight: "push", zoom: 1.5, travelStars: true },
  { id: "Ngc1097", stillId: "ngc-1097", flight: "track", zoom: 1.55, travelStars: true, bank: 0.1 },
  { id: "Ngc1232", stillId: "ngc-1232", flight: "orbit", zoom: 1.45, travelStars: true, bank: 0.2 },
  { id: "Ngc1275", stillId: "ngc-1275", flight: "pull", zoom: 1.5, travelStars: true },
  { id: "Ngc1309", stillId: "ngc-1309", flight: "glide", zoom: 1.55, travelStars: true, bank: -0.12 },
  { id: "Ngc1365", stillId: "ngc-1365", flight: "orbit", zoom: 1.45, travelStars: true, bank: 0.18 },
  { id: "Ngc1514", stillId: "ngc-1514", flight: "pull", zoom: 1.6, travelStars: true },
  { id: "Ngc2207", stillId: "ngc-2207", flight: "track", zoom: 1.5, travelStars: true, bank: 0.08 },
  { id: "Ngc3314", stillId: "ngc-3314", flight: "punch", zoom: 1.65, travelStars: true },
  { id: "Ngc346", stillId: "ngc-346", flight: "rise", zoom: 1.45, travelStars: true },
  { id: "Ngc4214", stillId: "ngc-4214", flight: "pull", zoom: 1.5, travelStars: true },
  { id: "Ngc4921", stillId: "ngc-4921", flight: "push", zoom: 1.5, travelStars: true },
  { id: "Ngc604", stillId: "ngc-604", flight: "punch", zoom: 1.7, travelStars: true },
  { id: "Ngc7049", stillId: "ngc-7049", flight: "orbit", zoom: 1.55, travelStars: true, bank: 0.16 },
  { id: "PandorasCluster", stillId: "pandoras-cluster", flight: "rise", zoom: 1.5, travelStars: true },
  { id: "PencilNebula", stillId: "pencil-nebula", flight: "glide", zoom: 1.5, travelStars: true, bank: -0.18 },
  { id: "Penguin", stillId: "penguin", flight: "track", zoom: 1.5, travelStars: true, bank: 0.12 },
  { id: "Retina", stillId: "retina", flight: "orbit", zoom: 1.6, travelStars: true, bank: 0.22 },
  { id: "RhoOphiuchi", stillId: "rho-ophiuchi", flight: "orbit", zoom: 1.45, travelStars: true, bank: 0.16 },
  { id: "Rosette", stillId: "rosette", flight: "pull", zoom: 1.5, travelStars: true },
  { id: "RunningChicken", stillId: "running-chicken", flight: "track", zoom: 1.45, travelStars: true, bank: 0.1 },
  { id: "SculptorGalaxy", stillId: "sculptor-galaxy", flight: "push", zoom: 1.5, travelStars: true },
  { id: "Serpens", stillId: "serpens", flight: "glide", zoom: 1.55, travelStars: true, bank: -0.14 },
  { id: "Sn1987a", stillId: "sn-1987a", flight: "punch", zoom: 1.75, travelStars: true },
  { id: "Spindle", stillId: "spindle", flight: "track", zoom: 1.6, travelStars: true, bank: 0.14 },
  { id: "SwanNebula", stillId: "swan-nebula", flight: "orbit", zoom: 1.4, travelStars: true, bank: 0.18 },
  { id: "ThorsHelmet", stillId: "thors-helmet", flight: "rise", zoom: 1.5, travelStars: true },
  { id: "Trifid", stillId: "trifid", flight: "rise", zoom: 1.45, travelStars: true, bank: 0.1 },
  { id: "TwinJet", stillId: "twin-jet", flight: "orbit", zoom: 1.6, travelStars: true, bank: 0.2 },
  { id: "Uranus", stillId: "uranus", flight: "pull", zoom: 1.7, travelStars: true },
  { id: "Wr124", stillId: "wr-124", flight: "punch", zoom: 1.7, travelStars: true },
  { id: "Wr140", stillId: "wr-140", flight: "pull", zoom: 1.6, travelStars: true },
];

const missionShots: Array<{
  id: string;
  stillId: StillId;
  flight: Flight;
  zoom: number;
  travelStars?: boolean;
  bank?: number;
}> = [
  { id: "ArtemisLaunch", stillId: "artemis-launch", flight: "rise", zoom: 1.65 },
  { id: "HubbleOrbit", stillId: "hubble-orbit", flight: "orbit", zoom: 1.5, travelStars: true, bank: 0.18 },
  { id: "Curiosity", stillId: "curiosity", flight: "track", zoom: 1.4, bank: 0.08 },
  { id: "Earthrise", stillId: "earthrise", flight: "rise", zoom: 1.45, travelStars: true },
  { id: "Pluto", stillId: "pluto", flight: "orbit", zoom: 1.55, travelStars: true, bank: 0.16 },
];

const cosmicShots: Array<{ id: string; props: CosmicProps }> = [
  { id: "NightFlight", props: { event: "flight", title: "Night Flight", seed: "night-flight" } },
  { id: "MeteorShower", props: { event: "meteors", title: "Meteor Shower", seed: "meteor-shower" } },
  { id: "Supernova", props: { event: "supernova", title: "Supernova", seed: "supernova" } },
  { id: "BlackHole", props: { event: "blackhole", title: "Black Hole", seed: "black-hole" } },
];

export const RemotionRoot: FC = () => {
  return (
    <>
      {cosmicShots.map((shot) => (
        <Composition
          key={`${shot.id}Reel`}
          id={`${shot.id}Reel`}
          component={CosmicVideo}
          schema={cosmicSchema}
          fps={REEL.fps}
          durationInFrames={REEL.durationInFrames}
          width={REEL.width}
          height={REEL.height}
          defaultProps={shot.props}
        />
      ))}
      {nebulaShots.map((shot) => (
        <Composition
          key={`${shot.id}Reel`}
          id={`${shot.id}Reel`}
          component={NebulaFly}
          schema={nebulaSchema}
          fps={REEL.fps}
          durationInFrames={REEL.durationInFrames}
          width={REEL.width}
          height={REEL.height}
          defaultProps={{
            ...nebulaBase,
            stillId: shot.stillId,
            flight: shot.flight,
            zoom: shot.zoom,
            meteors: shot.meteors ?? false,
            travelStars: shot.travelStars ?? false,
            bank: shot.bank ?? 0,
          }}
        />
      ))}
      {deepShots.map((shot) => (
        <Composition
          key={`${shot.id}Reel`}
          id={`${shot.id}Reel`}
          component={NebulaFly}
          schema={nebulaSchema}
          fps={REEL.fps}
          durationInFrames={REEL.durationInFrames}
          width={REEL.width}
          height={REEL.height}
          defaultProps={{
            ...nebulaBase,
            stillId: shot.stillId,
            flight: shot.flight,
            zoom: shot.zoom,
            meteors: false,
            travelStars: shot.travelStars ?? true,
            bank: shot.bank ?? 0,
          }}
        />
      ))}
      {missionShots.map((shot) => (
        <Composition
          key={`${shot.id}Reel`}
          id={`${shot.id}Reel`}
          component={NebulaFly}
          schema={nebulaSchema}
          fps={REEL.fps}
          durationInFrames={REEL.durationInFrames}
          width={REEL.width}
          height={REEL.height}
          defaultProps={{
            ...nebulaBase,
            stillId: shot.stillId,
            flight: shot.flight,
            zoom: shot.zoom,
            meteors: false,
            travelStars: shot.travelStars ?? false,
            bank: shot.bank ?? 0,
          }}
        />
      ))}
    </>
  );
};
