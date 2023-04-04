const ProjectAbout = ({ isAboutDisplayed, setIsAboutDisplayed }) => {
  const aboutDisplayHandler = () => setIsAboutDisplayed(false);
  return (
    <div className="popupPage">
      <div className="popupContent">
        <button onClick={aboutDisplayHandler}>close</button>
        <h3>About the Amazon Park Community Experience Project</h3>
        <p>
          Soy milk creamy cauliflower alfredo cumin artichoke hearts strawberry
          mango smoothie creamiest raspberries cayenne black bean chili dip
          almond milk chai latte chili pepper cool grains sweet potato basil
          picnic salad jalapeño. Seitan cashew pinch of yum entree candy cane
          winter overflowing berries apple vinaigrette four-layer lemon lime
          minty grenadillo frosted gingerbread bites seeds chickpea crust pizza
          udon noodles mint lime taco salsa salad pumpkin roasted brussel
          sprouts Thai super chili. Naga viper bruschetta veggie burgers morning
          smoothie bowl apples spiced pumpkin chili Italian pepperoncini green
          onions black bean wraps dark and stormy samosa tasty basmati
          blackberries walnut mushroom tart bite sized hummus falafel bowl red
          pepper açai lemonade zest lemon hummus pineapple salsa cool off sesame
          soba noodles cozy butternut.
        </p>
        <p>
          Falafel bites pasta ginger carrot spiced juice blueberry pops cremini
          mushrooms cinnamon toast edamame hummus lemongrass summertime avocado
          dressing drizzle winter roasted butternut squash chili raspberry fizz
          coriander habanero golden summer fruit salad coconut crispy red curry
          tofu noodles cauliflower casserole garlic sriracha noodles chai tea.
          Mediterranean cozy cinnamon oatmeal smoked tofu homemade balsamic
          pomegranate soup mediterranean vegetables kung pao pepper Sicilian
          pistachio pesto avocado basil pesto portobello mushrooms toasted
          hazelnuts green tea spiced peppermint blast red grapes crunchy
          blueberries peppermint Southern Italian lavender lemonade maple orange
          tempeh ginger lemongrass agave green tea sparkling pomegranate punch.
        </p>
      </div>
    </div>
  );
};

export default ProjectAbout;
