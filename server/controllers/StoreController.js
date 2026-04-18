const User = require('../models/user');
const Home = require('../models/Home');

const { cosineSimilarity, createVector } = require("../utils/recommendation");

exports.getRecommendations = async (req, res) => {
  try {
    const homes = await Home.find();

    const target = homes.find(
      h => h._id.toString() === req.params.id
    );

    if (!target) {
      return res.status(404).json({ message: "Home not found" });
    }

    const targetVector = createVector(target);

    const scoredHomes = homes
      .filter(h => h._id.toString() !== target._id.toString())
      .map(home => {
        const vector = createVector(home);
        const similarity = cosineSimilarity(targetVector, vector);

        return {
          home,
          score: similarity
        };
      });

    const recommendations = scoredHomes
      .sort((a, b) =>
        b.score - a.score || b.home.averageRating - a.home.averageRating
      )
      .slice(0, 6)
      .map(item => item.home);

    res.json(recommendations);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


// for user based recommnedation 




// exports.getHybridRecommendations = async (req, res) => {
//   try {
//     const userId = req.user._id;

//     const activities = await UserActivity.find({ userId });

//     const homes = await Home.find();

//     const userHomeIds = activities.map(a => a.homeId.toString());

//     const userHomes = homes.filter(h =>
//       userHomeIds.includes(h._id.toString())
//     );

//     // preference vector
//     let preference = [0,0,0,0,0,0,0];

//     userHomes.forEach(home => {
//       const vec = createVector(home);
//       preference = preference.map((v,i)=> v + vec[i]);
//     });

//     const scored = homes.map(home => {
//       const vec = createVector(home);
//       const similarity = cosineSimilarity(preference, vec);

//       return { home, score: similarity };
//     });

//     const recommendations = scored
//       .sort((a,b)=> b.score - a.score || b.home.averageRating - a.home.averageRating)
//       .slice(0,6)
//       .map(i=> i.home);

//     res.json(recommendations);

//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };

exports.getHybridRecommendations = async (req, res) => {
  try {
    const userId = req.session.userId;

    if (!userId) {
      return res.status(401).json({ msg: "Login first" });
    }

    const activities = await UserActivity.find({ userId });

    const homes = await Home.find();

    // 🎯 split actions
    const favIds = activities
      .filter(a => a.action === "favourite")
      .map(a => a.homeId.toString());

    const bookIds = activities
      .filter(a => a.action === "book")
      .map(a => a.homeId.toString());

    // ❤️ Favourite homes
    const favHomes = homes.filter(h => favIds.includes(h._id.toString()));

    // 📦 Booked homes (more important)
    const bookHomes = homes.filter(h => bookIds.includes(h._id.toString()));

    // 🧠 Preference vector
    let preference = [0,0,0,0,0,0,0];

    // ⭐ bookings = high weight
    bookHomes.forEach(home => {
      const vec = createVector(home);
      preference = preference.map((v,i)=> v + vec[i]*2); // weight = 2
    });

    // ❤️ favourites = normal weight
    favHomes.forEach(home => {
      const vec = createVector(home);
      preference = preference.map((v,i)=> v + vec[i]);
    });

    // 💰 avg price
    const allPrefHomes = [...bookHomes, ...favHomes];

    const avgPrice =
      allPrefHomes.reduce((sum,h)=> sum + h.price, 0) /
      (allPrefHomes.length || 1);

    // 🎯 scoring
    const scored = homes.map(home => {

      const vec = createVector(home);
      const similarity = cosineSimilarity(preference, vec);

      const ratingScore = home.averageRating || 0;

      const priceDiff = Math.abs(home.price - avgPrice);
      const priceScore = -priceDiff;

      return {
        home,
        score:
          (ratingScore * 3) +      // ⭐ priority 1
          (similarity * 2) +       // 🤖 priority 2
          (priceScore * 0.01)      // 💰 priority 3
      };
    });

    const recommendations = scored
      .sort((a,b)=> b.score - a.score)
      .slice(0,6)
      .map(i=> i.home);

    res.json(recommendations);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


// 🔵 GET ALL HOMES (for Home page)
exports.registeredhome = async (req, res) => {
  try {
    const homes = await Home.find().sort({ createdAt: -1 });
    res.json(homes);
  } catch (err) {
    console.log(err);
    res.status(500).json({ msg: "Error fetching homes" });
  }
};


// 🔵 GET INDEX (optional)
exports.getIndex = async (req, res) => {
  try {
    const homes = await Home.find().sort({ createdAt: -1 });
    res.json(homes);
  } catch (err) {
    res.status(500).json({ msg: "Error" });
  }
};


// 🔵 HOME DETAILS
exports.getHomeDetails = async (req, res) => {
  try {
    const homeId = req.params.homeid;

    const home = await Home.findById(homeId)
      .populate("reviews.user", "first_name");

    if (!home) {
      return res.status(404).json({ message: "Home not found" });
    }

    // if (req.session.userId) {
    //   await UserActivity.create({
    //     userId: req.session.userId,
    //     homeId: home._id,
    //     action: "view"
    //   });
    // }

    res.json(home);

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" });
  }
};


exports.addToFavourite = async (req, res) => {
  try {
    const userId = req.session.userId;
    const homeId = req.body.homeid;

    if (!userId) {
      return res.status(401).json({ msg: "Login first" });
    }

    const user = await User.findById(userId);

    if (!user.favourites.includes(homeId)) {
      user.favourites.push(homeId);
      await user.save();
    }

     if (req.user) {
      await UserActivity.create({
        userId: req.user._id,
        homeId: homeid,
        action: "favourite"
      });
    }

    res.json({ success: true });

  } catch {
    res.status(500).json({ msg: "Error" });
  }
};


exports.getFavouriteList = async (req, res) => {
  try {
    const userId = req.session.userId;

    if (!userId) {
      return res.status(401).json({ msg: "Login first" });
    }

    const user = await User.findById(userId).populate("favourites");

    res.json(user.favourites);

  } catch {
    res.status(500).json({ msg: "Error fetching favourites" });
  }
};

exports.removeFavourite = async (req, res) => {
  try {
    const userId = req.session.userId;
    const homeId = req.params.homeid;   // ✅ fix here

    const user = await User.findById(userId);

    user.favourites = user.favourites.filter(
      fav => fav.toString() !== homeId
    );

    await user.save();

    res.json({ success: true });

  } catch {
    res.status(500).json({ msg: "Error removing favourite" });
  }
};



// 🔵 SEARCH
exports.searchHomes = async (req, res) => {
  try {
    const { search, minPrice, maxPrice } = req.query;

    let filter = {};

    if (search) {
      filter.$or = [
        { housename: { $regex: search, $options: "i" } },
        { "address.city": { $regex: search, $options: "i" } },
      ];
    }

    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }

    const homes = await Home.find(filter);

    res.json(homes);

  } catch (err) {
    res.status(500).json({ msg: "Search error" });
  }
};


// 🔵 404
exports.errorhand = (req, res) => {
  res.status(404).json({ msg: "Page not found" });
};
