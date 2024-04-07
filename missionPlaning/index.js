const express = require('express');



const { Settings, OpenAIAgent, OpenAI} = require("llamaindex");

const app = express();

app.use(express.json());
app.use(express.static('public'));


Settings.llm = new OpenAI({ model:  'gpt-4-1106-preview', apiKey: process.env['OPENAI_API_KEY']});


app.post("/mission", async (req, res) => {

  
  // Create an OpenAIAgent with the function tools
  const agent = new OpenAIAgent({
    llm: Settings.llm,
    systemPrompt: `You are a kerberal space mission planner.
Your goal is for a given mission to generate the perfect rocket for the mission given by the user.
For that you first need to first define the mission profile and architecture, calculating the mission requirement (orbit, delatv, required isp,...)
Then select the good KSP part for each rocket stage. 
In the end you need to output a json representation of the roket in the form of a json array of Kerbal part. like:

{
  "parts": [
    "solidBooster.sm.v2",
    "mk1pod.v2"
  ]
}

the available parts are: 
AdvancedCanard		Mk1FuselageStructural	adapterLargeSmallTri	evaRepairKit		liquidEngine2-2_v2	mk3FuselageLF_50	rtg			structuralIBeam3
CanardController	MpoProbe		adapterMk3-Mk2		evaScienceKit		liquidEngine2_v2	mk3FuselageMONO		sasModule		structuralMiniNode
CargoStorageUnit	MtmStage		adapterMk3-Size2	externalTankCapsule	liquidEngine3_v2	nacelleBody		science_module		structuralPanel1
CircularIntake		OrbitalScanner		adapterMk3-Size2Slant	externalTankRound	liquidEngineMainsail_v2	navLight1		seatExternalCmd		structuralPanel2
Clydesdale		R8winglet		adapterSize2-Mk2	externalTankToroid	liquidEngineMini_v2	noseCone		sensorAccelerometer	structuralPylon
ConformalStorageUnit	RAPIER			adapterSize2-Size1	fairingSize1		liquidEngine_v2		noseConeAdapter		sensorAtmosphere	structuralWing
Decoupler_0		RCSBlock_v2		adapterSize2-Size1Slant	fairingSize2		longAntenna		nuclearEngine		sensorBarometer		structuralWing2
Decoupler_1		RCSFuelTank		adapterSize3-Mk3	fairingSize3		mediumDishAntenna	omsEngine		sensorGravimeter	structuralWing3
Decoupler_2		RCSLinearSmall		adapterSmallMiniShort	fireworksLauncherBig	microEngine_v2		parachuteDrogue		sensorThermometer	structuralWing4
Decoupler_3		RCSTank1-2		adapterSmallMiniTall	fireworksLauncherSmall	miniFuelTank		parachuteLarge		sepMotor1		strutConnector
FuelCell		RCSblock_01_small	advSasModule		flag			miniFuselage		parachuteRadial		shockConeIntake		strutCube
FuelCellArray		RadialDrill		airScoop		flagPartFlat		miniIntake		parachuteSingle		smallCargoContainer	strutOcto
GearFixed		RadialOreTank		airbrake1		flagPartSize0		miniJetEngine		pointyNoseConeA		smallClaw		sweptWing
GearFree		RelayAntenna100		airlinerCtrlSrf		flagPartSize1		miniLandingLeg		pointyNoseConeB		smallCtrlSrf		sweptWing1
GearLarge		RelayAntenna5		airlinerMainWing	flagPartSize2		mk1-3pod		probeCoreCube		smallHardpoint		sweptWing2
GearMedium		RelayAntenna50		airlinerTailFin		flagPartSize3		mk1pod.v2		probeCoreHex		smallRadialEngine	tailfin
GearSmall		ReleaseValve		airplaneTail		foldingRadLarge		mk1pod_v2		probeCoreHex_v2		smallRadialEngine_v2	telescopicLadder
GooExperiment		Rockomax16_BW		airplaneTailB		foldingRadMed		mk2CargoBayL		probeCoreOcto2_v2	solarPanelOX10C		telescopicLadderBay
HECS2_ProbeCore		Rockomax32_BW		asasmodule1-2		foldingRadSmall		mk2CargoBayS		probeCoreOcto_v2	solarPanelOX10L		toroidalAerospike
HeatShield0		Rockomax64_BW		avionicsNoseCone	fuelLine		mk2Cockpit_Inline	probeCoreSphere_v2	solarPanelSP10C		trussAdapter
HeatShield1		Rockomax8BW		basicFin		fuelTank		mk2Cockpit_Standard	probeStackLarge		solarPanelSP10L		trussPiece1x
HeatShield2		SSME			batteryBank		fuelTankSmall		mk2CrewCabin		probeStackSmall		solarPanels1		trussPiece3x
HeatShield3		ScienceBox		batteryBankLarge	fuelTankSmallFlat	mk2DockingPort		radPanelEdge		solarPanels2		turboFanEngine
HighGainAntenna		Separator_0		batteryBankMini		fuelTank_long		mk2DroneCore		radPanelLg		solarPanels3		turboFanSize2
HighGainAntenna5	Separator_1		batteryPack		groundAnchor		mk2Fuselage		radPanelSm		solarPanels4		turboJet
HighGainAntenna5_v2	Separator_2		cargoContainer		groundLight1		mk2FuselageLongLFO	radialDecoupler		solarPanels5		vernierEngine
ISRU			Separator_3		commDish		groundLight2		mk2FuselageShortLFO	radialDecoupler1-2	solidBooster.sm.v2	wheelMed
InflatableHeatShield	ServiceBay_125_v2	crewCabin		ionEngine		mk2FuselageShortLiquid	radialDecoupler2	solidBooster1-1		wingConnector
InfraredTelescope	ServiceBay_250_v2	cupola			kerbalEVA		mk2FuselageShortMono	radialDrogue		solidBooster_sm_v2	wingConnector2
IntakeRadialLong	Shrimp			deltaWing		kerbalEVASlimSuit	mk2LanderCabin		radialEngineBody	solidBooster_v2		wingConnector3
JetEngine		Size3LargeTank		delta_small		kerbalEVASlimSuitFemale	mk2LanderCabin_v2	radialEngineMini_v2	spotLight1		wingConnector4
LargeTank		Size3SmallTank		dockingPort1		kerbalEVAfemale		mk2SpacePlaneAdapter	radialLiquidEngine1-2	spotLight1_v2		wingConnector5
Large_Crewed_Lab	Size3To2Adapter_v2	dockingPort2		ksp_r_largeBatteryPack	mk2_1m_Bicoupler	radialRCSTank		spotLight2		wingShuttleRudder
LaunchEscapeSystem	SmallGearBay		dockingPort3		ladder1			mk3CargoBayL		ramAirIntake		spotLight2_v2		wingStrake
LgRadialSolarPanel	SmallTank		dockingPortLarge	landerCabinSmall	mk3CargoBayM		rcsTankMini		spotLight3 		winglet
MK1CrewCabin		StandardCtrlSrf		dockingPortLateral	landingLeg1		mk3CargoBayS		rcsTankRadialLong	stackBiCoupler_v2	winglet3
MK1Fuselage		SurfAntenna		domeLight1		landingLeg1-2		mk3CargoRamp		rocketNoseConeSize3	stackPoint1		xenonTank
MK1IntakeFuselage	SurfaceScanner		elevon2			largeAdapter		mk3Cockpit_Shuttle	rocketNoseCone_v2	stackQuadCoupler	xenonTankLarge
Magnetometer		SurveyScanner		elevon3			largeAdapter2		mk3CrewCabin		rocketNoseCone_v3	stackTriCoupler_v2	xenonTankRadial
Mark1Cockpit		Thoroughbred		elevon5			largeSolarPanel		mk3FuselageLFO_100	roverBody		standardNoseCone
Mark2Cockpit		White			engineLargeSkipper_v2	launchClamp1		mk3FuselageLFO_25	roverBody_v2		stationHub
MiniDrill		adapterEngines		evaChute?		linearRcs		mk3FuselageLFO_50	roverWheel1		stripLight1
MiniISRU		adapterLargeSmallBi	evaCylinder		liquidEngine		mk3FuselageLF_100	roverWheel2		structuralIBeam1
Mite			adapterLargeSmallQuad	evaJetpack		liquidEngine2		mk3FuselageLF_25	roverWheel3		structuralIBeam2
`,

    verbose: true,
  });

  // Chat with the agent
  const response = await agent.chat({
    message: req.body.message,
  });

  // Print the response
  console.log(response);
    res.json(response);

  // extract the content between the "```" code blocks in response.response and stroe it in part variable
  let part = response.response.match(/```([^`]*)```/g);
  console.log(part);
  const fs = require('fs');
  fs.writeFileSync('../example.json', part, 'utf8');
  
  const exec = require('child_process').exec;
  exec('node ../assembly.js', (error, stdout, stderr) => { 

    console.log(error);
    console.log(stdout);

  });
  return;
});


let stepDic = {};
app.post("/update", async (req, res) => { 

    const runStep = await openai.beta.threads.runs.steps.list(
        req.body.runId,
        req.body.threadId
    );
    console.log(runStep);

    res.json(runStep);

});



app.listen(8081, () => {
    console.log('Server is running on port 8081');
});