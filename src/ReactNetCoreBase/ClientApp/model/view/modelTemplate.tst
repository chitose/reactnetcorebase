${
    using System.Collections;
    using System.Text;
    using IO = System.IO;
    using Typewriter.Extensions.Types;

    Template(Settings settings)
    {
        settings.OutputFilenameFactory = file => CamelCase(IO.Path.GetFileNameWithoutExtension(file.Name));
    }

    static bool IsIgnoreProperty(Property property) {
        return property.Attributes.Any(a => a.Name == "JsonIgnore");
    }

    static bool IsOptionalProperty(Property property) {
        return property.Attributes.Any(a => a.Name == "OptionalTypeScriptProperty");
    }

  static string CamelCase(string s)
    {
        if (string.IsNullOrEmpty(s)) return s;
        if (char.IsUpper(s[0]) == false) return s;
        var chars = s.ToCharArray();
        chars[0] = char.ToLowerInvariant(chars[0]);
        return new string(chars);
    }    

    IEnumerable < Property > InheritedProperties(Class @class)
    {
        while (@class != null)
        {
            foreach(var p in @class.Properties)
                if (!IsIgnoreProperty(p))
                yield return p;
            @class = @class.BaseClass;
        }
    }

    IEnumerable < Property > InheritedRequiredProperties(Class @class)
    {
        while (@class != null)
        {
            foreach(var p in @class.Properties)
                if (!IsIgnoreProperty(p) && !IsOptionalProperty(p))
                yield return p;
            @class = @class.BaseClass;
        }
    }

    IEnumerable < Property > InheritedOptionalProperties(Class @class)
    {
        while (@class != null)
        {
            foreach(var p in @class.Properties)
                if (!IsIgnoreProperty(p) && IsOptionalProperty(p))
                yield return p;
            @class = @class.BaseClass;
        }
    }

  private bool Visited(Type type, Dictionary < string, Type > set)
    {
        if (type.IsDefined && !set.ContainsKey(type.FullName)) {
            set.Add(type.FullName, type);
            return true;
        }
        return false;
    }

  private void VisitTypes(Class @class, Dictionary < string, Type > set)
    {
        foreach(var p in InheritedProperties(@class))
        {
            var t = p.Type.Unwrap();
            Visited(t, set);
        }
    }

  static Dictionary < File, IEnumerable < Type >> DependenciesCache = new Dictionary<File, IEnumerable<Type>>();

    IEnumerable < Type > Dependencies(File file)
    {
        IEnumerable < Type > result;
        if (DependenciesCache.TryGetValue(file, out result)) return result;

        var set = new Dictionary<string, Type>();
        foreach(var @class in file.Classes)
        VisitTypes(@class, set);
        result = set.Values;

        DependenciesCache.Add(file, result);
        return result;
    }

    bool HasEnumDependencies(File file) => Dependencies(file).Any(x => x.IsEnum);
    IEnumerable < Type > EnumDependencies(File file) => Dependencies(file).Where(t => t.IsEnum);
    IEnumerable < Type > ClassDependencies(File file) => Dependencies(file).Where(t => !t.IsEnum && t.name!="t");
}// Auto-generated using typewriter -> from model.tst
$HasEnumDependencies[import { $EnumDependencies[$Name][, ] } from '../enums';]
$ClassDependencies[import { $Name } from './$name';]
$Classes(ReactNetCoreBase.Models.View.*)[export interface $Name$IsGeneric[<T>] {
$InheritedRequiredProperties[  $name: $Type;
]$InheritedOptionalProperties[  $name?: $Type;
]}]